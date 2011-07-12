---
layout: post
author: Garrett Serack
title: Shallow Forking a Project
tags: developer coding shallow-forking
categories:
- Information
---
We're nearing the point where we're able to take open source projects and produce happy-shiny packages for them--uh yeah, *nearing*.  
It's gonna be a couple more weeks shaking out the tools that generate new Visual Studio project files for a given project and wire all that stuff up.

The good news though, is that we're ready to have people start shallow-forking projects and sticking them into [Github](http://github.com/coapp-packages). 

 

###What's a "shallow-fork" you say? 

A [fork](http://bit.ly/lGYOb6) happens when developers take a copy of source code from one software package and starts independent development on it, creating a distinct piece of software.  A shallow-fork is when the independent development continually brings forward changes from the original project, and attempts not to stray very far from it.  We do this so that we can make appropriate Windows changes (like new build scripts, or better API support) keep compatibility and not break the original project.  If the upstream project is willing to accept changes, great! If not (for whatever reason)... great! Either way, the package maintainer for the CoApp project will aim to keep the projects in sync as much as possible. 

Linux distributions do this sort of thing all the time, in order to build packages for their specific version of Linux.  We're essentially following in the same footsteps, but following the procedure that I'm setting out here, so that we can eventually produce packages of software for CoApp.

 

###Can You Help?

We're looking for people to start the leg-work for building packages right now, this means creating a fork in github, and doing the work to get it compiling under Windows no matter how it's done (i.e., you can use a makefile, VS project files, a batch file... whatever). The idea is to just get a successful build that can be replicated on a known configuration--Visual Studio 2010 (even [VS 2010 express](http://www.microsoft.com/express/Downloads/)), and the [Windows SDK 7.1](http://download.microsoft.com/download/A/6/A/A6AC035D-DA3F-4F0C-ADA4-37C8E5D34E3D/winsdk_web.exe) ... We'll be automating the work later that creates well-built VS 2010 project files (and eventually other builds like mingw, etc), but that work will leverage the effort done now to create consistent shallow-forks.

 

###What do you need?
1.  The aforementioned Visual Studio 2010 (the [express](http://www.microsoft.com/express/Downloads/) version will do), and the [Windows SDK 7.1](http://download.microsoft.com/download/A/6/A/A6AC035D-DA3F-4F0C-ADA4-37C8E5D34E3D/winsdk_web.exe).

2. [An account on github](https://github.com/signup/free), and the ability to check stuff in (you can use [msysgit](http://code.google.com/p/msysgit/) or [tortoisegit](http://code.google.com/p/tortoisegit/) , or any other git client for Windows even the [Mercurial](http://mercurial.selenic.com/downloads/) plugin [hg-git](http://hg-git.github.com/), which lets you use git repositories as if they were mercurial repositories. *(Note: I tried the hg-git plugin, and had to use the version [here](https://github.com/sampsyo/hg-git) to get it to work)*

3. The ability to build software using Visual Studio we need command line builds, but if you get it working from inside the IDE, we can show you how to automate that from the command line in a single step.

4. The ability to follow the pretty-darn-simple process below to produce the necessary build.

5. A current build of the CoApp tools. You can [compile them yourself](http://fearthecowboy.com/2011/04/26/weve-moved-coapp-code-hosting-to-github/), or just download my [latest snapshot build](http://cdn.coapp.org/files/coapp-tools-snapshot.zip). Make it easy on yourself, put them in a folder that's in the %PATH%.
 

###Becoming a package maintainer
The first thing is to get yourself added as a CoApp package-maintainer on github no worries, signing up for this isn't a lifelong commitment. If you are interested in keeping it moving over the long haul, that's great, but even if you can just do up a few projects and get them checked in, we'll figure out the long term maintenance strategy later.

In order to get added to the package maintainer group you can send me a message on github (fearthecowboy) or via [email](mailto:garretts@microsoft.com), or heck, even just send me a [tweet](http://twitter.com/home?status=Hey%2C+%40fearthecowboy%21+I%27d+like+to+become+a+%23CoApp+package+maintainer.+My+github+id+is+...). All I need is your github account id, and I'll add you to the group.

 

###Wait! Before You Begin...
Since shallow-forking is intended to continually merge in changes from upstream, please keep changes to the project and its files to an absolute minimum don't do any unnecessary changes, don't reorganize the files, and don't try to rebuild a 'cleaner' build process.  You only need to get it to the point where it builds a viable output.  As we progress, we'll capture the data from the process and build shiny new project files that are much nicer expending extra effort now doesn't get you anywhere.

 

###If you run into trouble, and need help
Check on IRC #coapp on freenode.net (try the [webclient](http://webchat.freenode.net/) if you don't have IRC installed) if I'm there, I'm more than willing you help you thru the steps (and fix stuff that needs fixing), or failing that on the (mailing list)[https://launchpad.net/~coapp-developers].

 

###The Process for Shallow-Forking for CoApp packages
Quick Note: This is the first iteration of the Shallow-Fork process there are a number of deeper issues when forking projects that have multiple active branches, several configurations, etc.  What we're trying to do here is lay out a common approach so that as we proceed, we can automate as much as possible over the long run.   This procedure is likely to evolve quite a bit as we account for more scenarios and add support for additional compilers, configurations and build types.


1. Find an open source C/C++ library or application that you'd like to fork.  You can select one off the list of things that we know we really need, or something else that of particular interest to you, and for which you'd like to see a CoApp package created.  If the project that you want to build has things that it depends on, you may need to go ahead and provide the shallow-fork for that as well we do not want to rely on binary builds that someone else has provided, that would be kinda silly.

2. Create a project in Github. Depending on what you're trying to make a fork of, you're going to do this in one of a few different ways.  If the project is already on github, create a fork for it in the coapp-packages organization. If the source is posted as a zip file, unpack it and create the project manually. If it's in another VCS, there may be a generally-acceptable method to creating a fork in git.  Bottom line, get the project into Github in a project in the coapp-packages organization.

3. Clone the source code into your working directory.

4. Create a folder in the root of the project called **COPKG**.

5. Create a text file in the folder called **.buildinfo** this is the file that you will be putting the build steps into. 

    The format of the .buildinfo file can be thought of something akin to a .css file.  Simple values need not be quoted (but it's ok to do so).  It supports comments ( double-slash and /* */), C# style string literals (may be preceded by an @ symbol to make a string multi-line).  

    Inside the **.buildinfo** file,  insert the following: 
{% highlight c# %}#product-info  {
    product-name: "";
    version: "";
    original-source-location: "";
    original-source-website: "";
    license: "";
    packager: "";
}{% endhighlight %}
You can fill in the values of each of the fields. An example for libjpeg (done by Rafael)
{% highlight c# %}#product-info  {
    product-name: "libjpeg";
    version: "8c";
    original-source-location: "http://ijg.org/files/jpegsr8c.zip";
    original-source-website: "http://ijg.org";
    license: "Custom license, see README";
    packager: "Rafael Rivera <rafael@withinwindows.com>";
}{% endhighlight %}

#####Create one or more Build Configurations 

A "**Build Configuration**" is analogous to a build configuration with Visual Studio You can create builds for x86, x64, as well as for different flavors (static library vs. dynamic library) etc.  It's not necessary to explicitly create multiple build configuration for x86 and x64 if project compiles well under both without different commands (save for the selection of which platform).  You **do** want multiple configurations when the steps change between platforms (or you know that different files get processed in some libraries, there are separate files for x86 vs. x64), or if you have different expected outputs i.e. some libraries allow you to generate a static and a dynamic version of the same library).  Generally speaking, err on the side of caution and don't create multiple build configurations excessively for projects that behave themselves, we'll autogenerate the alternate configurations when we get around to creating new Visual Studio projects. 

The build configuration syntax: 

{% highlight c# %}
name  {
    /* optional -- defaults to vc10-x86 */
    compiler: compiler-tag ;
            // currently supported values are vc10-x86 and vc10-x64 
            //... we'll add more compilers in the future.
 
    /* optional -- only used if this project has dependencies on others
                -- may be specified mutiple times */
    uses: bld-cfg="..\path" ;
            // bld-cfg is the build configuration in dependent project
            // the 'blg-cfg=' part can be omitted to depend on the default
            // path is to the root path of the dependent project that 
            // contains a COPKG\.buildinfo file.
 
    targets: { ... } ;
            // a comma seperated list of the binary files that are output 
            // that are of significance
 
    build-command: "";
            // either a single command line, or a batch script 
            // that has the commands to build the targets listed above.
 
    clean-command: "";
            // either a single command line, or a batch script 
            // that has the commands to remove all temporary files 
            // created during a build.
}
{% endhighlight %}

The above libjpeg example continued note that there isn't any **uses** option: 

{% highlight c# %}
x86 {
    compiler: vc10-x86;
      
    targets: {
        // main library
        "Release\jpeg.lib",
         
        // extra utilities
        "cjpeg\Release\cjpeg.exe",
        "djpeg\Release\djpeg.exe",
        "jpegtran\Release\jpegtran.exe",
        "rdjpgcom\Release\rdjpgcom.exe",
        "wrjpgcom\Release\wrjpgcom.exe",
    };
      
    build-command:@"
        copy jconfig.vc jconfig.h       
        copy makejsln.v10 makejsln.sln
        copy makeasln.v10 makeasln.sln
        copy makejvcx.v10 jpeg.vcxproj
        copy makecvcx.v10 cjpeg.vcxproj
        copy makedvcx.v10 djpeg.vcxproj
        copy maketvcx.v10 jpegtran.vcxproj
        copy makewvcx.v10 wrjpgcom.vcxproj
        copy makervcx.v10 rdjpgcom.vcxproj
        msbuild /p:Platform=Win32 /p:Configuration=Release makejsln.sln
        msbuild /p:Platform=Win32 /p:Configuration=Release makeasln.sln
    ";
      
    clean-command:@"
        attrib -S -H -R *
        del /Q *.sdf *.suo *.sln *.vcxproj *.user jconfig.h 2>NUL
        rmdir /S /Q Release 2>NUL
         
        rmdir /S /Q cjpeg 2>NUL
        rmdir /S /Q djpeg 2>NUL
        rmdir /S /Q ipch 2>NUL
        rmdir /S /Q jpegtran 2>NUL
        rmdir /S /Q rdjpgcom 2>NUL
        rmdir /S /Q wrjpgcom 2>NUL
    ";
};
{% endhighlight %}

##### Once you have the .buildinfo file complete, you can run the pTk tool from the command line (make sure you're in the root of the project). 

**You should be able to run a build: **
{% highlight bat %}
C:\forks\libjpeg>ptk clean
 
CoApp Project pTk Version 1.0.2.906 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp portingToolkit for porting apps
-------------------------------------------------------------------------------
   
    ( build happens here ... )
 
Project Built.
 
C:\forks\libjpeg>
{% endhighlight %}

** ... and a clean :  **

{% highlight bat %}
C:\forks\libjpeg>ptk clean
 
CoApp Project pTk Version 1.0.2.906 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp portingToolkit for porting apps
-------------------------------------------------------------------------------
   
    ( build happens here ... )
 
Project Built.
 
C:\forks\libjpeg>
{% endhighlight %}

... and a verify (where it builds, verifies the build targets, cleans, and verifies everything is clean): 

{% highlight bat %}
C:\forks\libjpeg>ptk verify
CoApp Project pTk Version 1.0.2.906 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp portingToolkit for porting apps
-------------------------------------------------------------------------------
 ( build happens here ... )
 
Targets Verified.
Project Verified.
 
C:\forks\libjpeg>
{% endhighlight %}
Once it does what you expect, commit and push the clean version up to github, and give me a shout.