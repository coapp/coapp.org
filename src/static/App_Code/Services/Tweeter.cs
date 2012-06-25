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
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.WindowsAzure;
    using CoApp.Toolkit.Exceptions;
    using CoApp.Toolkit.Logging;
    using CoApp.Toolkit.Tasks;
    using Twitterizer;

    public class Tweeter {

        private static IDictionary<string, IEnumerable<string>> _options;
        private OAuthTokens tokens;

        public bool CanTweet {
            get {
                return tokens != null;
            }
        }

        public Tweeter(string twitterHandle) {
            try {
                var twitterKey = CloudConfigurationManager.GetSetting("twitter-key");
                var twitterSecret = CloudConfigurationManager.GetSetting("twitter-secret");
                var accessToken = CloudConfigurationManager.GetSetting(twitterHandle + "-access-token");
                var accessSecret = CloudConfigurationManager.GetSetting(twitterHandle + "-access-secret");

                if (!string.IsNullOrEmpty(twitterKey) && !string.IsNullOrEmpty(twitterSecret) && !string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(accessSecret)) {
                    tokens = new OAuthTokens {
                        ConsumerKey = twitterKey,
                        ConsumerSecret = twitterSecret,
                        AccessToken = accessToken,
                        AccessTokenSecret = accessSecret

                    };
                }
            }
            catch {
                throw new ConsoleException("Unable to authenticate '{0}'", twitterHandle);
            }

            if (tokens == null) {
                throw new ConsoleException("Unable to authenticate '{0}'", twitterHandle);
            }
        }
         
        public Task<TwitterResponse<TwitterStatus>> Tweet(string format, params object[] args) {
            return CanTweet
                ? Task<TwitterResponse<TwitterStatus>>.Factory.StartNew(() => {
                    try {
                        var status = TwitterStatus.Update(tokens, string.Format(format, args));
                        return status;
                    }
                    catch (Exception e) {
                        Logger.Error("{0} -- {1}\r\n{2}", e.GetType(), e.Message, e.StackTrace);
                    }
                    return null;
                })
                : CoTask.AsResultTask<TwitterResponse<TwitterStatus>>(null);
        }
    }
}