<%@ WebHandler Language="C#" Class="Telemetry" %>

using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using CoApp.Toolkit.Collections;
using CoApp.Toolkit.Configuration;
using CoApp.Toolkit.Extensions;
using CoApp.Toolkit.Logging;
using Extensions;
using Handlers;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Services;

public class Telemetry : RequestHandler {
    private const string Container = "telemetry";
    private static XDictionary<string,string> tmpFiles = new XDictionary<string, string>();
    
    public override void  Get(HttpResponse response, string relativePath, CoApp.Toolkit.Pipes.UrlEncodedMessage message) {
        var blobName = "{0}-{1}-installedfiles.log".format(Environment.GetEnvironmentVariable("COMPUTERNAME"), DateTime.Today.ToString("yyyyMMMdd"));
        var tmpName = tmpFiles.GetOrAdd(blobName, () => (Container + blobName).MD5Hash().GenerateTemporaryFilename());
        Logger.Message("filename is '{0}'", tmpName);
        // return Task.Factory.StartNew(() => _cloudFileSystem.Value[Container][blobName].Lock(blob => {
        
            // var blob = _cloudFileSystem.Value[Container][blobName];
        _cloudFileSystem.Value[Container][blobName].Lock( blob => {
            try {
                blob.CopyToFile(tmpName);
            } catch {
                // no file? no problem. we'll create it.
            }

            using (var writer = File.AppendText(tmpName)) {
                writer.WriteLine(message.ToString());
            }

            // blob.UploadByteArray();
            blob.CopyFromFile(tmpName);

            response.WriteString("OK", this);
            response.StatusCode = 200;
        });
        
    }
}