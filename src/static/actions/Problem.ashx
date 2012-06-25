<%@ WebHandler Language="C#" Class="Problem" %>

using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using CoApp.Toolkit.Configuration;
using CoApp.Toolkit.Extensions;
using Extensions;
using Handlers;
using Microsoft.WindowsAzure;
using Services;

public class Problem : RequestHandler {
    private const string Container = "telemetry";

    public override void Get(HttpResponse response, string relativePath, CoApp.Toolkit.Pipes.UrlEncodedMessage message) {
        Post(response, relativePath, message);
    }

    public override void Post(HttpResponse response, string relativePath, CoApp.Toolkit.Pipes.UrlEncodedMessage message) {
        var blobName = "{0}-{1}-{2}-debug.log".format(message["uniqId"], message["hash"], DateTime.Today.ToString("yyyyMMdd"));
        _cloudFileSystem.Value[Container][blobName].WriteText(message["content"]);
        response.WriteString("ACCEPTED.");
        response.StatusCode = 200;
    }
}