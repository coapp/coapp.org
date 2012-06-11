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
    using System.Net;
    using System.Threading.Tasks;
    using System.Web;
    using Newtonsoft.Json.Linq;
    using Toolkit.Collections;
    using Toolkit.Logging;
    using Toolkit.Pipes;
    using Toolkit.Tasks;
    using Toolkit.Utility;
    using Microsoft.WindowsAzure;

    public class CommitMessageHandler : RequestHandler {
        private Tweeter _tweeter;
        private IDictionary<string, string> _aliases = new XDictionary<string,string>();
        private bool _initialized;

        public override void LoadSettings(HttpContext context) {
            lock (this) {
                if (!_initialized) {
                    var twitterHandle = CloudConfigurationManager.GetSetting("tweet-commits");
                    if (!string.IsNullOrEmpty(twitterHandle)) {
                        _tweeter = new Tweeter(twitterHandle);
                    }

                    _initialized = true;
                }
            }
        }

        public override Task Get(HttpResponse response, string relativePath, UrlEncodedMessage message) {
            response.WriteString("<html><body>Relative Path: {0}<br>GET : <br>", relativePath);

            foreach( var key in message ) {
                response.WriteString("&nbsp;&nbsp;&nbsp;{0} = {1}<br>", key, message[key]);
            }

            Bus.SendRegenerateSiteMessage();

            response.WriteString("</body></html>");

            return "".AsResultTask();
        }


        public override Task Post(HttpResponse response, string relativePath, UrlEncodedMessage message) {
            var payload = message["payload"];
            if( payload == null ) {
                response.StatusCode = 500;
                response.Close();
                return "".AsResultTask();
            }

            var result = Task.Factory.StartNew( () => {
                try {
                    dynamic json = JObject.Parse(payload);
                    Logger.Message("MSG Process begin {0}", json.commits.Count);
                    
                    var count = json.commits.Count;
                    var doSiteRebuild = false;
                    for (int i = 0; i < count; i++) {
                        var username = json.commits[i].author.username.Value;
                        var commitMessage = json.commits[i].message.Value;
                        var repository = json.repository.name.Value;
                        
                        var url = (string)json.commits[i].url.Value;
                        if (repository == "coapp.org") {
                            doSiteRebuild = true;
                        }

                        Bitly.Shorten(url).ContinueWith( (bitlyAntecedent) => {
                            var commitUrl = bitlyAntecedent.Result;

                            var handle = _aliases.ContainsKey(username) ? _aliases[username] : username;
                            var sz = repository.Length + handle.Length + commitUrl.Length + commitMessage.Length + 10;
                            var n = 140 - sz;

                            if (n < 0) {
                                commitMessage = commitMessage.Substring(0, (commitMessage.Length + n) - 3) + "...";
                            }
                            _tweeter.Tweet("{0} => {1} via {2} {3}", repository, commitMessage, handle, commitUrl);
                            Logger.Message("{0} => {1} via {2} {3}", repository, commitMessage, handle, commitUrl);
                        });

                    }
                    // just rebuild the site once for a given batch of rebuild commit messages.
                    if( doSiteRebuild) {
                        Task.Factory.StartNew(() => {
                            try {
                                Logger.Message("Rebuilding website.");
                                Bus.SendRegenerateSiteMessage();

                            } catch( Exception e ) {
                                HandleException(e);
                            }

                        });
                    }    
                } catch(Exception e) {
                    Logger.Error("Error handling uploaded package: {0} -- {1}\r\n{2}", e.GetType(), e.Message, e.StackTrace);
                    HandleException(e);
                    response.StatusCode = 500;
                    response.Close();
                }
            }, TaskCreationOptions.AttachedToParent);

            result.ContinueWith( antecedent => {
                if (result.IsFaulted) {
                    var e = antecedent.Exception.InnerException;
                    Logger.Error("Error handling commit message: {0} -- {1}\r\n{2}", e.GetType(), e.Message, e.StackTrace);
                    HandleException(e);
                    response.StatusCode = 500;
                    response.Close();
                }
            }, TaskContinuationOptions.OnlyOnFaulted);

            return result;
        }
    }
}