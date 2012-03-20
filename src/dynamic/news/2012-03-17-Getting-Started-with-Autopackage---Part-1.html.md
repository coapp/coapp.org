---
layout: post
author: Eric Schultz
twitter: wwahammy
title: Getting Started with Autopackage
tags: ['gsoc']
docid: "news:20120317"
---

One of CoApp's recommended Google Summer of Code ideas is a [CoApp Package Maker GUI (Reference #2012-001)](http://www.outercurve.org/Overview/SummerofCode). Currently package creation is performed with the autopackage which takes .autopkg files as input. Creating these .autopkg files can be rather daunting we intend the GUI tool to streamline the creation and management of these files.

To help students interested in GSoC (and anyone else new to the project), I'm creating a set of tutorials teaching the basics of autopackage. I'll start with preparing your development system and creating very simple packages in this post.

##Preparation

Autopackage currently has a few requirements outside of the CoApp ecosystem. You'll need to install these requirements before moving forward:

1. [WiX Toolset v 3.6 Beta](http://wix.codeplex.com/releases/view/75656)
2. [Windows SDK v7.1](http://www.microsoft.com/download/en/details.aspx?id=8279)

<p class="alert-message block-message success">
    While not explicitly required yet, it's highly recommended that you <a href="http://code.google.com/p/msysgit/"> install Git</a> at this time as well.
</p> 

After installing those, we have your system ready for Autopackage. Autopackage is part of the CoApp.Devtools package and can be downloaded from the [CoApp package directory](http://coapp.org/pages/packages.html). Download this file and follow the installation prompts.

###Creating a signing certificate

All CoApp packages are required to be signed. In order to create a package, you need to have a code signing certificate. A simple shell script used for creating a test code signing certificate is available as a CoApp package called MakeTestCert.

To install MakeTestCert, run the following command at an administrator command prompt:

```bash
coapp install maketestcert
```

Now we're going to create a test certificate. Once MakeTestCert is installed, open the Windows Sdk Command Prompt as an administrator. Once there navigate to a folder where you'd like to place your test certificate and type:


```bash
MakeTestCert "test_cert"
```

You'll be asked for a password, which is used to protect the private key for signing. Once you've entered a password and the command is complete. There will be two files created in the folder called "test_cert.cer" and "test_cert.pfx."  The first one just contains the public key and the second contains the public and private key and is used for signing packages. We'll need this later! 

Next let's make sure the key is added to the trusted root authorities on the computer. Run the following command:

```bash
certmgr.exe /add test_cert.cer /s /r localMachine root
```

This places your test certificate into the root of your certificate store on your computer. Additionally, your 

###Creating the sample package

Download the [sample package](https://github.com/ericschultz/MakeTestCert/zipball/sample) and extract it. 

<p class="alert-message block-message success">
    You could use git to clone the repository at (https://github.com/ericschultz/MakeTestCert/).
</p> 

This is a simplified source for the MakeTestCert package we installed earlier. In the root, you'll find a set of files and folders. Ignoring the readme and the files and folders used by Git, we have one file, MakeTestCert-Sample.cmd. This is the main shell script used by MakeTestCert.

You'll also see the COPKG directory. In the root of the source of every coapp package, you'll find a COPKG directory. This contains the information necessary to build and create the package. Inside that folder is one file, in this case called MakeTestCert.autopkg, which defines a package. Let's open that file for editing.

.autopkg files have a syntax similar to CSS files. In future posts, I'll discuss what all the rules mean but for now let's do a simple modification to the file to get our feet wet. Find the following line:

```css
publisher: "YOURNAME";
```

Since you're the creating the package, you might as well get some credit as the publisher. :) Replace YOURNAME with your actual name and save the file.

Now that we've finished the autopkg file, let's build the actual package. Navigate back to the root and run the following command:

```bash
autopackage COPKG\MakeTestCert.autopkg --certificate-path="PATH\TO\test_cert.pfx" --password=PASSWORD_YOU_USED_BEFORE --remember
```

After the  command complete (it takes a while the first time while autopackage finds WiX), you will have a file called MakeTestCert-SAMPLE-1.0.0.0-any.msi in the COPKG directory. This is your package! Run this MSI and you'll install you're personally created copy of MakeTestCert-SAMPLE. Since the autopkg file puts MakeTestCert-SAMPLE, you can run MakeTestCert-SAMPLE from any command prompt.

<p class="alert-message block-message success">
The --remember argument isn't required but you'll probably want to use it. Why you ask? --remember saves the certificate and your password  into the registry (in an encrypted form of course) for use by autopackage and a few other CoApp tools. Once you've used --remember, you won't have to provide a certificate path or password in the future for tools that need them. In that case you could run
<br/>
<br/>
<code>
autopackage COPKG\MakeTestCert.autopkg
</code>
</p> 

###Where do I go from here?

Over the next few weeks, I will have additional tutorials that describe more features of Autopackage. In the mean time, play around with autopackage and look at the .autopkg files used by CoApp and by the packages in the [coapp-packages organization](https://github.com/coapp-packages). Additionally feel free to email me at (wwahammy@gmail.com), contact me on Twitter [@wwahammy](http://twitter.com/wwahammy) or visit our [IRC channel](http://coapp.org/developers/irc.html). Feel free to ask questions! We know CoApp can be a bit daunting (that's why we have the GSoC projects!) and we're very interested in helping!



