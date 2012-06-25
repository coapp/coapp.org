//-----------------------------------------------------------------------
// <copyright company="steve marx">
//     Copyright (c) 2010-2012 steve marx
//     Additional Contributors can be discovered using the 'git log' command.
// </copyright>
// <license>
//     Microsoft Public License (Ms-PL)
// This license governs use of the accompanying software. If you use the software, you accept this license. If you do not accept the license, do not use the software.
// 1. Definitions
// The terms "reproduce," "reproduction," "derivative works," and "distribution" have the same meaning here as under U.S. copyright law.
// A "contribution" is the original software, or any additions or changes to the software.
// A "contributor" is any person that distributes its contribution under this license.
// "Licensed patents" are a contributor's patent claims that read directly on its contribution.
// 2. Grant of Rights
// (A) Copyright Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free copyright license to reproduce its contribution, prepare derivative works of its contribution, and distribute its contribution or any derivative works that you create.
// (B) Patent Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free license under its licensed patents to make, have made, use, sell, offer for sale, import, and/or otherwise dispose of its contribution in the software or derivative works of the contribution in the software.
// 3. Conditions and Limitations
// (A) No Trademark License- This license does not grant you rights to use any contributors' name, logo, or trademarks.
// (B) If you bring a patent claim against any contributor over patents that you claim are infringed by the software, your patent license from such contributor to the software ends automatically.
// (C) If you distribute any portion of the software, you must retain all copyright, patent, trademark, and attribution notices that are present in the software.
// (D) If you distribute any portion of the software in source code form, you may do so only under this license by including a complete copy of this license with your distribution. If you distribute any portion of the software in compiled or object code form, you may only do so under a license that complies with this license.
// (E) The software is licensed "as-is." You bear the risk of using it. The contributors give no express warranties, guarantees or conditions. You may have additional consumer rights under your local laws which this license cannot change. To the extent permitted under your local laws, the contributors exclude the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
// </license>
//-----------------------------------------------------------------------

namespace Services {
#if unused
    using System;
    using System.IO;
    using System.Net;
    using Microsoft.WindowsAzure.StorageClient;
    using Microsoft.WindowsAzure.StorageClient.Protocol;

    public static class LeaseBlobExtensions {
        public static string TryAcquireLease(this CloudBlob blob) {
            try {
                return blob.AcquireLease();
            } catch (WebException e) {
                if (((HttpWebResponse)e.Response).StatusCode != HttpStatusCode.Conflict) // 409, already leased
                {
                    throw;
                }
                e.Response.Close();
                return null;
            }
        }

        public static string AcquireLease(this CloudBlob blob) {
            var creds = blob.ServiceClient.Credentials;
            var transformedUri = new Uri(creds.TransformUri(blob.Uri.AbsoluteUri));
            var req = BlobRequest.Lease(transformedUri,
                90, // timeout (in seconds)
                LeaseAction.Acquire, // as opposed to "break" "release" or "renew"
                null); // name of the existing lease, if any
            blob.ServiceClient.Credentials.SignRequest(req);
            using (var response = req.GetResponse()) {
                return response.Headers["x-ms-lease-id"];
            }
        }

        private static void DoLeaseOperation(CloudBlob blob, string leaseId, LeaseAction action) {
            var creds = blob.ServiceClient.Credentials;
            var transformedUri = new Uri(creds.TransformUri(blob.Uri.AbsoluteUri));
            var req = BlobRequest.Lease(transformedUri, 90, action, leaseId);
            creds.SignRequest(req);
            req.GetResponse().Close();
        }

        public static void ReleaseLease(this CloudBlob blob, string leaseId) {
            DoLeaseOperation(blob, leaseId, LeaseAction.Release);
        }

        public static bool TryRenewLease(this CloudBlob blob, string leaseId) {
            try {
                blob.RenewLease(leaseId);
                return true;
            } catch {
                return false;
            }
        }

        public static void RenewLease(this CloudBlob blob, string leaseId) {
            DoLeaseOperation(blob, leaseId, LeaseAction.Renew);
        }

        public static void BreakLease(this CloudBlob blob) {
            DoLeaseOperation(blob, null, LeaseAction.Break);
        }

        // NOTE: This method doesn't do everything that the regular UploadText does.
        // Notably, it doesn't update the BlobProperties of the blob (with the new
        // ETag and LastModifiedTimeUtc). It also, like all the methods in this file,
        // doesn't apply any retry logic. Use this at your own risk!
        public static void UploadText(this CloudBlob blob, string text, string leaseId) {
            string url = blob.Uri.AbsoluteUri;
            if (blob.ServiceClient.Credentials.NeedsTransformUri) {
                url = blob.ServiceClient.Credentials.TransformUri(url);
            }
            var req = BlobRequest.Put(new Uri(blob.ServiceClient.Credentials.TransformUri(blob.Uri.AbsoluteUri)),
                90, new BlobProperties(), BlobType.BlockBlob, leaseId, 0);
            using (var writer = new StreamWriter(req.GetRequestStream())) {
                writer.Write(text);
            }
            blob.ServiceClient.Credentials.SignRequest(req);
            req.GetResponse().Close();
        }

        public static void SetMetadata(this CloudBlob blob, string leaseId) {
            var req = BlobRequest.SetMetadata(new Uri(blob.ServiceClient.Credentials.TransformUri(blob.Uri.AbsoluteUri)), 90, leaseId);
            foreach (string key in blob.Metadata.Keys) {
                req.Headers.Add("x-ms-meta-" + key, blob.Metadata[key]);
            }
            blob.ServiceClient.Credentials.SignRequest(req);
            req.GetResponse().Close();
        }
    }
#endif
}