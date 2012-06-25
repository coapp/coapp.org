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

namespace Services {
#if UNUSED
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Security.Cryptography;
    using Microsoft.Win32;
    using CoApp.Toolkit.Extensions;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;
    using CoApp.Toolkit.Compression;
    using CoApp.Toolkit.Exceptions;


 

    public class Blob {
        private static readonly char[] PathChars = new[] {
            '\\', '/'
        };

        private readonly CloudBlob _actualBlob;
        internal Blob(CloudBlob actualBlob) {
            _actualBlob = actualBlob;
        }
        public static implicit operator CloudBlob( Blob blob) {
            return blob._actualBlob;
        }

        public string Name {
            get {
                return _actualBlob.Name;
            }
        }

        public string Filename {
            get {
                return _actualBlob.Name.Substring(_actualBlob.Name.LastIndexOfAny(PathChars) + 1);
            }
        }

        public string Path {
            get {
               // var containerUri = new Uri(_actualBlob.Container.Uri.AbsoluteUri + "/" + ContainerName);
                return "";
            }
        }

        public string ContainerName {
            get {
                return _actualBlob.Container.Name;
            }
        }

        public Uri Uri {
            get {
                return _actualBlob.Uri;
            }
        }

        public string MD5 {
            get {
                return _actualBlob.Properties.ContentMD5;
            }
        }

        public DateTime Timestamp {
            get {
                return _actualBlob.Properties.LastModifiedUtc.ToLocalTime();
            }
        }

        public long Length {
            get {
                return _actualBlob.Properties.Length;
            }
        }

    }

    public class CloudContainer {
        private CloudBlobContainer _actualContainer;
        internal CloudContainer(CloudBlobContainer actualContainer) {
            _actualContainer = actualContainer;
        }

        public static implicit operator CloudBlobContainer( CloudContainer container ) {
            return container._actualContainer;
        }

        public IEnumerable<string> Names {
            get {
                var containerUri = new Uri(_actualContainer.Uri.AbsoluteUri + "/" + _actualContainer.Name);
                return _actualContainer.ListBlobs(new BlobRequestOptions {UseFlatBlobListing = true}).Select(each => containerUri.MakeRelativeUri(each.Uri).ToString());
            }
        }

        public CloudBlob this[string index] {
            get {
                 return _actualContainer.GetBlobReference(index);
            }
        }
    }

    public class CloudFileSystem {
        private static CloudStorageAccount _account;
        private static CloudBlobClient _blobStore;

        public CloudFileSystem(string accountName, string accountKey) {
            _account = new CloudStorageAccount(new StorageCredentialsAccountAndKey(accountName, accountKey), true);
            _blobStore = _account.CreateCloudBlobClient();
        }

        public CloudContainer this[string index] {
            get {
                var container = _blobStore.GetContainerReference(index.ToLower());
                if( !container.Exists() ) {
                    container.CreateIfNotExist();

                    var stream = new MemoryStream();
                    try {
                        container.GetBlobReference("__testblob99").UploadFromStream(stream);
                        container.GetBlobReference("__testblob99").Delete();

                        var permissions = container .GetPermissions();
                        permissions.PublicAccess = BlobContainerPublicAccessType.Container;
                        container .SetPermissions(permissions);

                    } catch /* (StorageClientException e) */ {
                        throw new CoAppException("Failed creating container '{0}'. This may happen if the container was recently deleted (in which case, try again).".format(index));
                    }
                } 
                return new CloudContainer(container);
            }
        }
           
        public bool ContainerExists( string name ) {
            return _blobStore.GetContainerReference(name).Exists();
        }
    
        public void RemoveContainer(string name) {
            if (ContainerExists(name)) {
                var container = _blobStore.GetContainerReference(name);
                container.Delete();
            }
        }

        public IEnumerable<string> Names {
            get {
                return _blobStore.ListContainers().Select(each => each.Name); 
            }
        }
    }
#endif 

#if FALSE
    public class oldCloudFileSystem {
        private static CloudStorageAccount _account;
        private static CloudBlobClient _blobStore;
        private static CloudFileSystem _instance;

        public static CloudFileSystem Instance {
            get {
                lock (typeof(CloudFileSystem)) {
                    if (_instance == null) {
                        var azureAccount = CloudConfigurationManager.GetSetting("azure-storage-name");
                        var azureKey = CloudConfigurationManager.GetSetting("azure-storage-key");
                        _instance = new CloudFileSystem(azureAccount, azureKey);
                    }
                    return _instance;
                }
            }
        }

        
        private oldCloudFileSystem(string accountName, string accountKey) {
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
            containerName = containerName.ToLower();
            return _blobStore.ListContainers().Any(each => each.Name == containerName);
        }

        public void AddContainer(string name) {
            name = name.ToLower();

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

        

        public void WriteBlob(string containerName, string blobName, byte[] data, Action<long> progress = null) {
            progress = progress ?? (p => { });
            var tmpName = (containerName + "/" + blobName).MakeSafeFileName().GenerateTemporaryFilename();
            File.WriteAllBytes(tmpName, data);
            WriteBlob(containerName, blobName, tmpName, false, progress);
        }

        public void WriteBlobText(string containerName, string blobName, string data, Action<long> progress = null) {
            progress = progress ?? (p => { });
            var tmpName = (containerName + "/" + blobName).MakeSafeFileName().GenerateTemporaryFilename();
            File.WriteAllText(tmpName, data);
            WriteBlob(containerName, blobName, tmpName, false, progress);
        }

        private CloudBlob GetBlob(string containerName, string blobName) {
            if (!ContainerExists(containerName)) {
                throw new CoAppException("Blob container '{0}' not found.".format(containerName));
            }
            var container = _blobStore.GetContainerReference(containerName);
            return container.GetBlobReference(blobName);
        }

        public void WriteBlob(CloudBlob blob, string localFilename,bool gzip = false, Action<long> progress = null) {
            progress = progress ?? (p => { });
            
            if (!File.Exists(localFilename)) {
                throw new FileNotFoundException("local filename does not exist", localFilename);
            }

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
        }

        public void Lock(string containerName, string blobName, Action<CloudBlob> action) {
            if (ContainerExists(containerName)) {
                var container = _blobStore.GetContainerReference(containerName);
                var blob = container.GetBlobReference(blobName);
                AutoRenewLease.Lock(blob, action);
            }
        }

        public byte[] ReadBlob(string containerName, string blobName, Action<long> progress = null) {
            progress = progress ?? (p => {});
            var tmpName = (containerName+"/"+blobName).MakeSafeFileName().GenerateTemporaryFilename();
            ReadBlob(containerName, blobName, tmpName, progress);
            return File.ReadAllBytes(tmpName);
        }

        public string ReadBlobText(string containerName, string blobName, Action<long> progress = null) {
            progress = progress ?? (p => { });
            var tmpName = (containerName + "/" + blobName).MakeSafeFileName().GenerateTemporaryFilename();
            ReadBlob(containerName, blobName, tmpName, progress);
            return File.ReadAllText(tmpName);
        }

        public void ReadBlob(string containerName, string blobName, string localFilename, Action<long> progress = null) {
            progress = progress ?? (p => { });

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
    #endif
}
