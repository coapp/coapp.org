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
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Web;

    public static class HttpResponseExtensions {
        public static void WriteString( this HttpResponse response, string format, params string[] args ) {
            var text = string.Format(format, args);
            var buffer = Encoding.UTF8.GetBytes(text);
            response.OutputStream.Write(buffer, 0, buffer.Length);
            response.OutputStream.Flush();
        }

        public static string ReplaceWhile(this string input, string from, string to) {
            if (!string.IsNullOrEmpty(input)) {
                while (input.Contains(from)) {
                    input = input.Replace(from, to);
                }
            }
            return input;
        }

        public static bool IsHttp(this string input) {
            return (input ?? "").StartsWith("http://", StringComparison.OrdinalIgnoreCase) || (input ?? "").StartsWith("https://", StringComparison.OrdinalIgnoreCase);
        }

        public static string HttpSlashed(this string input, params string[] peices) {
            input = input ?? "";
            var prefix = "http:/";
            if (input.IsHttp()) {
                var colon = input.IndexOf(":");
                prefix = input.Substring(0,colon+2);
                input = input.Substring(colon+2);
               //  return ((peices ?? new string[0]).Aggregate((input ?? "").ReplaceWhile("//", "/").Trim('/', '\\'), (current, each) => current + "/" + (each ?? "").ReplaceWhile("//", "/").Trim('/', '\\')) + "/").ReplaceWhile("//", "/");
            }
            return prefix+input.Slashed(peices);
        }

        public static string Slashed(this string input, params string[] peices ) {
            if( input.IsHttp() ) {
                return input.HttpSlashed(peices);
            }
            return ("/" + (peices ?? new string[0]).Aggregate((input ?? "").ReplaceWhile("//", "/").Trim('/', '\\'), (current, each) => current + "/" + (each ?? "").ReplaceWhile("//", "/").Trim('/', '\\')) + "/").ReplaceWhile("//", "/");
        }
    }
}