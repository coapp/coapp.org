//-----------------------------------------------------------------------
// <copyright company="CoApp Project">
//     Copyright (c) 2010-2012 Garrett Serack and CoApp Contributors. 
//     Contributors can be discovered using the 'git log' command.
//     All rights reserved.
// </copyright>
// <license>
//     The software is licensed under the Apache 2.0 License (the "License")
//     You may not use the software except in compliance with the License. 
// </license>
//-----------------------------------------------------------------------

namespace CoApp.RepositoryService {
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Security.Cryptography;
    
    using Microsoft.Win32;
    using CoApp.Toolkit.Extensions;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;
    using Toolkit.Compression;
    using Toolkit.Exceptions;
    using RegistryView = Toolkit.Configuration.RegistryView;

    public class CloudFileSystem {
        private CloudStorageAccount _account;
        private RegistryView _accountSettings;
        private CloudBlobClient _blobStore;

        public CloudFileSystem(RegistryView settingsRoot, string accountName) : this( settingsRoot, accountName, null ) {
        }

        public CloudFileSystem(RegistryView settingsRoot, string accountName, string accountKey) {
            _accountSettings = settingsRoot["azure-storage"];

            if (string.IsNullOrEmpty(accountKey)) {
                // load it if not given
                accountKey = _accountSettings[accountName, "key"].EncryptedStringValue;
            } else {
                // store it if given
                _accountSettings[accountName, "key"].EncryptedStringValue = accountKey;
            }
            _account = new CloudStorageAccount(new StorageCredentialsAccountAndKey(accountName, accountKey), true);
            _blobStore = _account.CreateCloudBlobClient();
        }

        public void Close() {
            _account = null;
        }

        public IEnumerable<string> ContainerNames {
            get { return _blobStore.ListContainers().Select(each => each.Name); }
        }

        public bool ContainerExists(string containerName) {
            return _blobStore.ListContainers().Select(each => each.Name).ContainsIgnoreCase(containerName);
        }

        public void AddContainer(string name) {
            //Console.WriteLine("container:{0}", name);

            var container = _blobStore.GetContainerReference(name);
            container.CreateIfNotExist();

            var stream = new MemoryStream();
            try {
                container.GetBlobReference("__testblob99").UploadFromStream(stream);
                container.GetBlobReference("__testblob99").Delete();

                var permissions = container.GetPermissions();
                permissions.PublicAccess = BlobContainerPublicAccessType.Container;
                container.SetPermissions(permissions);

            } catch /* (StorageClientException e) */ {
                throw new CoAppException("Failed creating container '{0}'. This may happen if the container was recently deleted (in which case, try again).".format(name));
            }
        }

        public void RemoveContainer(string name) {
            if (ContainerExists(name)) {
                var container = _blobStore.GetContainerReference(name);
                container.Delete();
            }
        }

        public IEnumerable<string> GetBlobNames(string containerName, string fileMask = null) {
            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);
                var containerUri = new Uri(container.Uri.AbsoluteUri + "/" + containerName);
                return container.ListBlobs(new BlobRequestOptions { UseFlatBlobListing = true }).Select(each => containerUri.MakeRelativeUri(each.Uri).ToString()).Where(each => each.NewIsWildcardMatch(fileMask, true, ""));
            }
            return Enumerable.Empty<string>();
        }

        public IEnumerable<dynamic> GetBlobs(string containerName, string fileMask = null) {
            if (string.IsNullOrEmpty(fileMask)) {
                fileMask = "*";
            }

            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);
                var containerUri = new Uri(container.Uri.AbsoluteUri + "/" + containerName);
                return container.ListBlobs(new BlobRequestOptions { UseFlatBlobListing = true, BlobListingDetails = BlobListingDetails.All }).Where(each => containerUri.MakeRelativeUri(each.Uri).ToString().NewIsWildcardMatch(fileMask, true, "")).Select(each => {
                    var blob = (CloudBlob)each;

                    return new {
                        name = containerUri.MakeRelativeUri(each.Uri).ToString(),
                        uri = each.Uri,
                        md5 = blob.Properties.ContentMD5,
                        date = blob.Properties.LastModifiedUtc.ToLocalTime(),
                        length = string.Format("{0:N0}", blob.Properties.Length),
                    };
                });
            }
            return Enumerable.Empty<dynamic>();
        }

        public void EraseBlob(string containerName, string blobName) {
            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);
                var blob = container.GetBlobReference(blobName);
                blob.DeleteIfExists();
            }
        }

        private string LookupMimeType(string extension) {
            extension = extension.ToLower();

            var key = Registry.ClassesRoot.OpenSubKey("MIME\\Database\\Content Type");
            try {
                foreach (var keyName in key.GetSubKeyNames()) {
                    var temp = key.OpenSubKey(keyName);
                    if (extension.Equals(temp.GetValue("Extension"))) {
                        return keyName;
                    }
                }
            } finally {
                key.Close();
            }
            return "";
        }

        public void WriteBlob(string containerName, string blobName, string localFilename,bool gzip, Action<long> progress) {
            if (!File.Exists(localFilename)) {
                throw new FileNotFoundException("local filename does not exist", localFilename);
            }

            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);

                var blob = container.GetBlobReference(blobName);
                var md5 = string.Empty;
                try {
                    blob.FetchAttributes();

                    md5 = blob.Properties.ContentMD5;
                    if (string.IsNullOrEmpty(md5)) {
                        if (blob.Metadata.AllKeys.Contains("MD5")) {
                            md5 = blob.Metadata["MD5"];
                        }
                    }
                } catch {

                }

                var localMD5 = string.Empty;
                using (var stream = new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                    localMD5 = MD5.Create().ComputeHash(stream).ToHexString();
                }

                if (!string.Equals(md5, localMD5, StringComparison.CurrentCultureIgnoreCase)) {
                    // different file
                    blob.Properties.ContentType = LookupMimeType(Path.GetExtension(localFilename));
                    if (gzip) {
                        blob.Properties.ContentEncoding = "gzip";
                    }

                    try {
                        // copy to tmp file to compress to gz.
                        
                            if (gzip) {
                                var localGZFilename = localFilename.GenerateTemporaryFilename();
                                // Console.WriteLine("TEMP: {0}", localGZFilename);
                                using (var gzStream = new GZipStream(
                                    new FileStream(localGZFilename, FileMode.CreateNew), CompressionMode.Compress, CompressionLevel.BestCompression)) {
                                        using (var fs = new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                                        fs.CopyTo(gzStream);
                                        localFilename = localGZFilename;
                                    }
                                }
                            }
                        
                        using (var stream = new ProgressStream(new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read), progress)) {
                            blob.UploadFromStream(stream);
                            if (blob.Metadata.AllKeys.Contains("MD5")) {
                                blob.Metadata["MD5"] = localMD5;
                            } else {
                                blob.Metadata.Add("MD5", localMD5);
                            }
                            blob.SetMetadata();
                        }
                    } catch (StorageException e) {
                        if (e.ErrorCode == StorageErrorCode.BlobAlreadyExists || e.ErrorCode == StorageErrorCode.ConditionFailed) {
                            throw new ApplicationException("Concurrency Violation", e);
                        }
                        throw;
                    }
                } else {
                    if (progress != null) {
                        progress(100);
                    }
                }
                return;
            }
            throw new CoAppException("Container '{0}' does not exist".format(containerName));
        }

        public void ReadBlob(string containerName, string blobName, string localFilename, Action<long> progress) {
            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);
                var blob = container.GetBlobReference(blobName);
                var md5 = string.Empty;
                try {
                    blob.FetchAttributes();

                    md5 = blob.Properties.ContentMD5;
                    if (string.IsNullOrEmpty(md5)) {
                        if (blob.Metadata.AllKeys.Contains("MD5")) {
                            md5 = blob.Metadata["MD5"];
                        }
                    }
                } catch {

                }

                if (blob.Properties.Length == 0) {
                    throw new CoAppException("Remote blob '{0}' not found".format(blobName));
                }

                if (File.Exists(localFilename)) {
                    var localMD5 = string.Empty;
                    using (var stream = new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                        localMD5 = MD5.Create().ComputeHash(stream).ToHexString();
                    }
                    if (string.Equals(localMD5, md5, StringComparison.CurrentCultureIgnoreCase)) {
                        if (progress != null) {
                            progress(100);
                        }

                        return;
                    }

                    localFilename.TryHardToDelete();
                }

                try {
                    using (var stream = new ProgressStream(new FileStream(localFilename, FileMode.CreateNew), blob.Properties.Length, progress)) {
                        blob.DownloadToStream(stream);
                    }
                    // blob.dow
                    // blob.DownloadToFile(localFilename);
                } catch (StorageException e) {
                    if (e.ErrorCode == StorageErrorCode.BlobAlreadyExists || e.ErrorCode == StorageErrorCode.ConditionFailed) {
                        throw new ApplicationException("Concurrency Violation", e);
                    }
                    throw;
                }
                return;
            }
            throw new CoAppException("Container '{0}' does not exist".format(containerName));
        }

    }

    internal class ProgressStream : Stream {
        private readonly Stream _innerStream;
        private long _bytesProcessed;
        private readonly Action<long> _progressCallback;
        private readonly long _length;

        public ProgressStream(Stream inner, Action<long> callback) {
            _innerStream = inner;
            _length = inner.Length;
            _progressCallback = callback;
        }

        public ProgressStream(Stream inner, long length, Action<long> callback) {
            _innerStream = inner;
            _length = length;
            _progressCallback = callback;
        }

        protected override void Dispose(bool disposing) {
            _innerStream.Dispose();
            base.Dispose(disposing);
        }

        public override bool CanRead {
            get { return _innerStream.CanRead; }
        }

        public override bool CanSeek {

            get { return _innerStream.CanSeek; }
        }

        public override bool CanWrite {
            get { return _innerStream.CanWrite; }
        }

        public override long Length {
            get { return _innerStream.Length; }
        }

        public override long Position {
            get { return _innerStream.Position; }
            set { _innerStream.Position = value; }
        }

        public override void Flush() {
            _innerStream.Flush();
        }

        public override long Seek(long offset, SeekOrigin origin) {
            return _innerStream.Seek(offset, origin);
        }

        public override void SetLength(long value) {
            _innerStream.SetLength(value);
        }

        public override int Read(byte[] buffer, int offset, int count) {
            var bytesRead = _innerStream.Read(buffer, offset, count);

            // assume that this stream is only being read to (but not written to)...
            if (_progressCallback != null)
                _progressCallback((_bytesProcessed += bytesRead) * 100 / _length);

            return bytesRead;
        }

        public override void Write(byte[] buffer, int offset, int count) {
            _innerStream.Write(buffer, offset, count);

            if (_progressCallback != null)
                _progressCallback((_bytesProcessed += count) * 100 / _length);
        }
    }
}
