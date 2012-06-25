using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using CoApp.Toolkit.Extensions;

namespace Services {
#if UNUSED
    using System.Security.Cryptography;
    using System.Text;
    using CoApp.Toolkit.Compression;
    using CoApp.Toolkit.Exceptions;
    using CoApp.Toolkit.Logging;
    using Microsoft.Win32;
    using Microsoft.WindowsAzure.StorageClient;

    public static class BlobExtensions {
        private static string LookupMimeType(string extension) {
            extension = extension.ToLower();
            using( var key = Registry.ClassesRoot.OpenSubKey("MIME\\Database\\Content Type") ) {
                if (key != null) {
                    foreach (var subkey in key.GetSubKeyNames().Select(key.OpenSubKey)) {
                        using (subkey) {
                            if (extension.Equals(subkey.GetValue("Extension"))) {
                                return subkey.Name;
                            }
                        }
                    }
                }
            }
            return "";
        }

        public static void CopyToFile(this CloudBlob blob, string localFilename, Action<long> progress = null) {
            if( blob.Exists() ) {
                var md5 = string.Empty;
                try {
                    blob.FetchAttributes();

                    md5 = blob.Properties.ContentMD5;
                    if (string.IsNullOrEmpty(md5)) {
                        if (blob.Metadata.AllKeys.Contains("MD5")) {
                            md5 = blob.Metadata["MD5"];
                        }
                    }
                }
                catch {
                }

                if (File.Exists(localFilename)) {
                    if (string.Equals(localFilename.GetFileMD5(), md5, StringComparison.CurrentCultureIgnoreCase)) {
                        if (progress != null) {
                            progress(100);
                        }
                        return;
                    }
                    localFilename.TryHardToDelete();
                }

                try {
                    using (var stream = new ProgressStream(new FileStream(localFilename, FileMode.CreateNew), blob.Properties.Length, progress ?? (p => { }))) {
                        blob.DownloadToStream(stream);
                    }
                }
                catch (StorageException e) {
                    if (e.ErrorCode == StorageErrorCode.BlobAlreadyExists || e.ErrorCode == StorageErrorCode.ConditionFailed) {
                        throw new ApplicationException("Concurrency Violation", e);
                    }
                    throw;
                }
            }
        }

        private static string ToHexString(IEnumerable<byte> bytes) {
            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte num in bytes)
                stringBuilder.Append(num.ToString("x2"));
            return ((object)stringBuilder).ToString();
        }

        private static string GetFileMD5(string filename) {
            using (FileStream fileStream = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.Read))
                return ToHexString((IEnumerable<byte>)MD5.Create().ComputeHash((Stream)fileStream)).ToUpper();
        }

        public static void CopyFromFile(this CloudBlob blob, string localFilename,bool gzip = false, Action<long> progress = null) {
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

            var localMD5 = GetFileMD5(localFilename);

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
                          
                        using (var gzStream = new GZipStream(
                            new FileStream(localGZFilename, FileMode.CreateNew), CompressionMode.Compress, CompressionLevel.BestCompression)) {
                                using (var fs = new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                                fs.CopyTo(gzStream);
                                localFilename = localGZFilename;
                            }
                        }
                    }
                        
                    using (var stream = new ProgressStream(new FileStream(localFilename, FileMode.Open, FileAccess.Read, FileShare.Read), progress ?? (p => { }))) {
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
                        Logger.Error(e);
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

        public static void WriteText(this CloudBlob blob, string content, bool gzip = false, Action<long> progress = null) {
            var md5 = string.Empty;
            try {
                blob.FetchAttributes();

                md5 = blob.Properties.ContentMD5;
                if (string.IsNullOrEmpty(md5)) {
                    if (blob.Metadata.AllKeys.Contains("MD5")) {
                        md5 = blob.Metadata["MD5"];
                    }
                }
            }
            catch {
            }

            var localMD5 = content.MD5Hash();

            if (!string.Equals(md5, localMD5, StringComparison.CurrentCultureIgnoreCase)) {
                // different file
                blob.Properties.ContentType = LookupMimeType(Path.GetExtension(blob.Name));
                if (gzip) {
                    blob.Properties.ContentEncoding = "gzip";
                }

                try {
                    using (var stream = new ProgressStream(gzip ? (Stream)new GZipStream(new MemoryStream(content.ToByteArray()), CompressionMode.Compress, CompressionLevel.BestCompression) : new MemoryStream(content.ToByteArray()), progress ?? (p => { }))) {
                        blob.UploadFromStream(stream);
                        if (blob.Metadata.AllKeys.Contains("MD5")) {
                            blob.Metadata["MD5"] = localMD5;
                        } else {
                            blob.Metadata.Add("MD5", localMD5);
                        }
                        blob.SetMetadata();
                    }
                }
                catch (StorageException e) {
                    if (e.ErrorCode == StorageErrorCode.BlobAlreadyExists || e.ErrorCode == StorageErrorCode.ConditionFailed) {
                        throw new ApplicationException("Concurrency Violation", e);
                    }
                    throw;
                }
            }
            else {
                if (progress != null) {
                    progress(100);
                }
            }
        }

    }
#endif
}