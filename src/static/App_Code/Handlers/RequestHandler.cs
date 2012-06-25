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

namespace Handlers {
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    using CoApp.Toolkit.Logging;
    using CoApp.Toolkit.Pipes;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;
    using Services;

    public class RequestHandler : IHttpHandler {

        public virtual void LoadSettings(HttpContext context) {
            
        }

        protected static Lazy<CloudFileSystem> _cloudFileSystem = new Lazy<CloudFileSystem>(() => {
            var azureAccount = CloudConfigurationManager.GetSetting("azure-storage-name");
            var azureKey = CloudConfigurationManager.GetSetting("azure-storage-key");
            return new CloudFileSystem(azureAccount, azureKey);
        }, false);



        public void ProcessRequest(HttpContext context) {

            LoadSettings(context);

            var request = context.Request;
            var response = context.Response;
            var url = request.Url;

            var length = context.Request.ContentLength;
            

            var relativePath = request.Path;

            switch (context.Request.HttpMethod) {
                case "PUT":
                    try {
                        var putData = new byte[length];
                        var read = 0;
                        var offset = 0;
                        do {
                            read = request.InputStream.Read(putData, offset, (int)length - offset);
                            offset += read;
                        } while (read > 0 && offset < length);

                        Put(response, relativePath, putData);
                    }
                    catch (Exception e) {
                        HandleException(e);
                        response.StatusCode = 500;
                        response.Close();
                    }
                    break;

                case "GET":
                    try {
                        Get(response, relativePath, new UrlEncodedMessage(relativePath + "?" + url.Query));
                    }
                    catch (Exception e) {
                       HandleException(e);
                       response.StatusCode = 500;
                       response.Close();
                    }
                    break;

                case "HEAD":
                    try {
                        Head(response, relativePath, new UrlEncodedMessage(relativePath + "?" + url.Query));
                    }
                    catch (Exception e) {
                        HandleException(e);
                        response.StatusCode = 500;
                        response.Close();
                    }
                    break;

                case "POST":
                    try {
                        var postData = new byte[length];
                        var read = 0;
                        var offset = 0;
                        do {
                            read = request.InputStream.Read(postData, offset, (int)length - offset);
                            offset += read;
                        } while (read > 0 && offset < length);

                        Post(response, relativePath, new UrlEncodedMessage(relativePath + "?" + Encoding.UTF8.GetString(postData)));
                    }
                    catch (Exception e) {
                        HandleException(e);
                        response.StatusCode = 500;
                        response.Close();
                    }
                    break;

            }
            /*
            if (handlerTask != null) {
                handlerTask.ContinueWith((antecedent2) => {
                    if (antecedent2.IsFaulted && antecedent2.Exception != null) {
                        var e = antecedent2.Exception.InnerException;
                        HandleException(e);
                        response.StatusCode = 500;
                    }

                    response.Close();
                }, TaskContinuationOptions.AttachedToParent).Wait();
            }
            else {
                // nothing retured? must be unimplemented.
                response.StatusCode = 405;
                response.Close();
            }
             * */
        }

        public static void HandleException(Exception e) {
            if (e is AggregateException) {
                e = (e as AggregateException).Flatten().InnerExceptions[0];
            }
            
            // send it somewhere?
            Logger.Error("{0} -- {1}\r\n{2}", e.GetType(), e.Message, e.StackTrace);
        }

        public virtual bool IsReusable {
            get {
                return true;
            }
        }


        public virtual void Put(HttpResponse response, string relativePath, byte[] data) {
            return;
        }

        public virtual void Get(HttpResponse response, string relativePath, UrlEncodedMessage message) {
            return;
        }

        public virtual void Post(HttpResponse response, string relativePath, UrlEncodedMessage message) {
            return;
        }

        public virtual void Head(HttpResponse response, string relativePath, UrlEncodedMessage message) {
            return ;
        }
    }
}