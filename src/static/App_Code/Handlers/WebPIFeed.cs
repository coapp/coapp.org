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
    using System.Collections.Generic;
    using System.Linq;
    using System.Xml;
    using System.Xml.Linq;
    using CoApp.Packaging.Common.Model.Atom;
    using CoApp.Toolkit.DynamicXml;
    using CoApp.Toolkit.Extensions;
    using CoApp.Toolkit.Win32;

    /// <summary>
    ///   Summary description for WebPIFeed
    /// </summary>
    public class WebPIFeed : DynamicNode {
        private static XNamespace Atom = "http://www.w3.org/2005/Atom";

        public WebPIFeed(string actualUrl, string feedName, IEnumerable<AtomItem> items) : base(new XElement(Atom + "feed")) {
            dynamic doc = this;

            doc.version = "1.0.1";
            doc.webpiFile.Attributes.version = "3.0.1.0";
            doc.title = "CoApp Package Feed ({0})".format(feedName);
            doc.link.Attributes.href = actualUrl;
            doc.updated = XmlConvert.ToString(DateTime.UtcNow);
            doc.name = "CoApp ({0})".format(feedName);
            doc.description = "CoApp Package Feed ({0}) for the Web Platform Installer".format(feedName);
            doc.author.name = "CoApp Administrator";
            doc.author.uri = "http://coapp.org";
            doc.author.email = "coapp@coapp.org";
            doc.id = actualUrl;
            doc.generator = "CoApp Repository Service";

            // first, add CoApp Itself:

            dynamic coappEntry = Add("entry");
            coappEntry.productId = "CoApp";
            coappEntry.title = "CoApp Package Manager";
            coappEntry.summary = "CoApp Package Management system";
            coappEntry.longSummary = "CoApp, is the Common Opensource Application Publishing Platform, an open-source package management system for Windows.\r\nThe goal of the CoApp project is to create a community of developers dedicated to creating a set of tools and processes that enable other open source developers to create and maintain their open source products with Windows as a primary build target.";
            coappEntry.version = "1.2.0.0";
            coappEntry.updated = XmlConvert.ToString(DateTime.UtcNow);
            coappEntry.published = XmlConvert.ToString(DateTime.UtcNow);
            coappEntry.link = "http://coapp.org/packages";
            coappEntry.images.icon = "http://coapp.org/images/logo-small.png";

            coappEntry.discoveryHint.file.filePath = @"%allusersprofile%\coapp\coapp.exe";
            coappEntry.discoveryHint.file.minimumVersion = "1.2.0.400";

            var coappInstaller = coappEntry.installers.installer;
            coappInstaller.id = "1";
            coappInstaller.languageId = "en";

            coappInstaller.installerFile.installerURL = "http://coapp.org/install";
            coappInstaller.installCommands.cmdLine.exe = @"%systemroot%\system32\msiexec.exe";
            coappInstaller.installCommands.cmdLine.commandLineArguments = @"QUIET=1 /i ""%InstallerFile%""";
            coappInstaller.installCommands.cmdLine.ignoreExitCode = "false";

            foreach (var item in items) {
                dynamic entry = Add("entry");

                entry.productId = item.Model.CanonicalName.PackageName;
                entry.title = item.Title.Text;
                entry.summary = item.Model.PackageDetails.SummaryDescription;
                entry.longSummary = item.Model.PackageDetails.Description;
                entry.version = item.Model.Version;
                entry.updated = XmlConvert.ToString(item.LastUpdatedTime);
                entry.published = XmlConvert.ToString(item.PublishDate);
                if (!item.Authors.IsNullOrEmpty()) {
                    foreach (var author in item.Authors) {
                        dynamic a = entry.Add("author");
                        a.name = author.Name ?? "";
                        a.email = author.Email ?? "";
                        a.uri = author.Uri ?? "";
                    }
                }

                entry.dependency.productId = "CoApp";
                var kws = item.Model.Roles.Select(each => each.PackageRole.ToString()).Distinct();
                foreach (var keyword in kws) {
                    entry.keywords.Add("keywordId", "kw" + keyword);
                }

                entry.link = "http://coapp.org/packages";
                entry.images.icon = "http://coapp.org/images/logo-small.png";
                entry.discoveryHint.msiProductCode = item.Model.CanonicalName.ToString().CreateGuid().ToString("B");

                var installer = entry.installers.installer;
                installer.id = "1";
                installer.languageId = "en";
                if (item.Model.Architecture == Architecture.x64) {
                    installer.architectures.Add("x64");
                }
                /* if (item.Model.Architecture == Architecture.x86) {
                    installer.architectures.Add("x64" );
                    installer.architectures.Add("x86");
                } */
                installer.installerFile.installerURL = item.Model.Locations.First().AbsoluteUri;
                installer.installCommands.cmdLine.exe = @"%allusersprofile%\coapp\coapp.exe";
                installer.installCommands.cmdLine.commandLineArguments = @"install ""%InstallerFile%""";
                installer.installCommands.cmdLine.ignoreExitCode = "false";
            }

            doc.tabs.tab.keywordTab.id = "CoAppFeed";
            doc.tabs.tab.keywordTab.name = "CoApp ({0})".format(feedName);
            doc.tabs.tab.keywordTab.description = "Select Packages:";

            var roles = items.SelectMany(each => each.Model.Roles).Distinct();
            var keywordnames = roles.Select(each => each.PackageRole.ToString()).Distinct().ToArray();

            foreach (var keywordName in keywordnames) {
                doc.tabs.tab.keywordTab.keywords.Add("keywordId", "kw" + keywordName);
                var n = doc.keywords.Add("keyword", keywordName);
                n.Attributes.id = "kw" + keywordName;
            }
        }
    }
}