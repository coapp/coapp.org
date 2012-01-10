---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: How to create/unpack zip files in .NET without GPL Code
tags: ['developer', 'coding']
docid: "news:20101209"
---

The question occasionally comes up regarding how to create Zip files from C# without using GPL (or LGPL) code. If license isn't an issue, the simple answer is always is to use [ZipLib](http://www.icsharpcode.net/OpenSource/SharpZipLib/) which is a wonderful, and well known library for manipulating zip files.

The other solution is to grab [WiX 3.5](http://wix.codeplex.com/) and use the assemblies out of the WiX SDK:

* **Microsoft.Deployment.Compression.dll**
* **Microsoft.Deployment.Compression.Zip.dll**

Which contain the classes you'd need to manipulate zip files (and really easy to boot!)

``` csharp
using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.Deployment.Compression.Zip;
 
namespace TestZip {
    public class Test {
        public static void Main(string[] args) {
            var zipFile = new ZipInfo("test.zip");
            var filesToArchive = new List<string>() { @"test.exe", @"test.cs" };
            zipFile.PackFiles(null, filesToArchive, null); //create the zip file
            zipFile.Unpack(@".\testfolder\"); //unpack the zip file into a folder
        }
    }
}
```

Pretty simple, eh?