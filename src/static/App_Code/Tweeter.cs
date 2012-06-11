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
    using System.Net;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.WindowsAzure;
    using Toolkit.Collections;
    using Toolkit.Configuration;
    using Toolkit.Exceptions;
    using Toolkit.Logging;
    using Toolkit.Tasks;
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

    public class Bitly {
        private static string bitlyUsername;
        private static string bitlySecret;

        static Bitly() {
            bitlyUsername = CloudConfigurationManager.GetSetting("bitly-username");
            bitlySecret = CloudConfigurationManager.GetSetting("bitly-secret");
        }

        public static bool CanBitly {
            get {
                return !(string.IsNullOrEmpty(bitlySecret) || string.IsNullOrEmpty(bitlyUsername));
            }
        }

        private static readonly IDictionary<string, string> _bitlyCache = new XDictionary<string, string>();

        private static readonly string[] _domains =
            ".aero .asia .biz .cat .com .coop .edu .gov .info .int .jobs .mil .mobi .museum .name .net .org .pro .tel .travel .xxx .ac .ad .ae .af .ag .ai .al .am .an .ao .aq .ar .as .at .au .aw .ax .az .ba .bb .bd .be .bf .bg .bh .bi .bj .bm .bn .bo .br .bs .bt .bv .bw .by .bz .ca .cc .cd .cf .cg .ch .ci .ck .cl .cm .cn .co .cr .cu .cv .cx .cy .cz .de .dj .dk .dm .do .dz .ec .ee .eg .er .es .et .eu .fi .fj .fk .fm .fo .fr .ga .gb .gd .ge .gf .gg .gh .gi .gl .gm .gn .gp .gq .gr .gs .gt .gu .gw .gy .hk .hm .hn .hr .ht .hu .id .ie .il .im .in .io .iq .ir .is .it .je .jm .jo .jp .ke .kg .kh .ki .km .kn .kp .kr .kw .ky .kz .la .lb .lc .li .lk .lr .ls .lt .lu .lv .ly .ma .mc .md .me .mg .mh .mk .ml .mm .mn .mo .mp .mq .mr .ms .mt .mu .mv .mw .mx .my .mz .na .nc .ne .nf .ng .ni .nl .no .np .nr .nu .nz .om .pa .pe .pf .pg .ph .pk .pl .pm .pn .pr .ps .pt .pw .py .qa .re .ro .rs .ru .rw .sa .sb .sc .sd .se .sg .sh .si .sj .sk .sl .sm .sn .so .sr .st .su .sv .sy .sz .tc .td .tf .tg .th .tj .tk .tl .tm .tn .to .tp .tr .tt .tv .tw .tz .ua .ug .uk .us .uy .uz .va .vc .ve .vg .vi .vn .vu .wf .ws .ye .yt .za .zm .zw"
                .Split(' ');

        public static Task<string> Shorten(string data) {
            if (!CanBitly || data.Contains("tinyurl.com") || data.Contains("@") || data.Contains("bit.ly") || data.Contains("j.mp") || data.Length < 16) {
                return data.AsResultTask();
            }

            Uri uri = null;
            try {
                uri = new Uri(data);
            }
            catch (Exception) {
                try {
                    if (data.Contains(".")) {
                        uri = new Uri("http://" + data);
                    }
                }
                catch {
                    /* suppress */
                }
            }

            if (uri == null || !_domains.Contains((uri.DnsSafeHost.Substring(uri.DnsSafeHost.LastIndexOf('.'))))) {
                return data.AsResultTask();
            }

            if (_bitlyCache.ContainsKey(uri.AbsoluteUri)) {
                return _bitlyCache[uri.AbsoluteUri].AsResultTask();
            }

            return Task<string>.Factory.StartNew(() => {
                var bitly = new UriBuilder("http", "api.bit.ly", 80, "/v3/shorten");
                bitly.Query = string.Format("format={0}&longUrl={1}&domain={2}&login={3}&apiKey={4}", "txt", Uri.EscapeDataString(uri.AbsoluteUri), "j.mp", bitlyUsername, bitlySecret);

                try {
                    var request = (HttpWebRequest)WebRequest.Create(bitly.Uri);
                    var response = request.GetResponse();
                    var stream = response.GetResponseStream();
                    var buffer = new byte[8192];
                    var read = stream.Read(buffer, 0, 8192);
                    var newUrl = Encoding.UTF8.GetString(buffer, 0, read).Trim();

                    if (!_bitlyCache.ContainsKey(uri.AbsoluteUri)) {
                        _bitlyCache.Add(uri.AbsoluteUri, newUrl);
                    }
                    return newUrl;
                }
                catch {
                    // meh. no good.
                    return uri.AbsolutePath;
                }
            });
        }
    }
}