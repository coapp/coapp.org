---
layout: development
subtitle: Shallow Forking
---

## The Process for Shallow-Forking for CoApp packages

> Quick Note: This is the first iteration of the Shallow-Fork process there are a 
> number of deeper issues when forking projects that have multiple active branches, 
> several configurations, etc.  What we're trying to do here is lay out a common 
> approach so that as we proceed, we can automate as much as possible over the 
> long run.   This procedure is likely to evolve quite a bit as we account for 
> more scenarios and add support for additional compilers, configurations and build types.

> If you have updates or fixes to this procedure, pass them along!

### 1. Get Setup for Development

- tools
- github
- coapp-packages

### 2. Select an open source project to fork.

Find an open source C/C++ library or application that you'd like to fork.  
You can select one off the list of things that we know we really need, or 
something else that of particular interest to you, and for which you'd like 
to see a CoApp package created.  If the project that you want to build has things that it depends on, you may need to go ahead and provide the shallow-fork for that as well we do not want to rely on binary builds that someone else has provided, that would be kinda silly.

### 3. Create a project in Github. 

Depending on what you're trying to make a fork of, you're going to do this in 
one of a few different ways.  If the project is already on github, create a fork
for it in the coapp-packages organization. If the source is posted as a zip file,
unpack it and create the project manually. If it's in another VCS, there may be a
generally-acceptable method to creating a fork in git.  Bottom line, get the project
into Github in a project in the coapp-packages organization.

### 4. Clone the source code into your working directory.

git clone *url*

### 5. Create the COPKG folder in the project root.

Create a folder in the root of the project called **COPKG**.

### 6. Create the .buildinfo file in the COPKG directory

Create a text file in the folder called **.buildinfo** this is the file that you will be putting the build steps into. 

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

### 7. Create one or more Build Configurations 

A "**Build Configuration**" is analogous to a build configuration with Visual Studio You can 
create builds for x86, x64, as well as for different flavors (static library vs. dynamic library)
etc.  It's not necessary to explicitly create multiple build configuration for x86 and x64 if
project compiles well under both without different commands (save for the selection of which platform).  

You **do** want multiple configurations when the steps change between platforms (or you know that 
different files get processed in some libraries, there are separate files for x86 vs. x64), or if you have 
different expected outputs i.e. some libraries allow you to generate a static and a dynamic version of the 
same library).  Generally speaking, err on the side of caution and don't create multiple build configurations 
excessively for projects that behave themselves, we'll autogenerate the alternate configurations when 
we get around to creating new Visual Studio projects. 

The build configuration syntax: 

{% highlight c# %}
name  {
    /* optional -- defaults to vc10-x86 */
    compiler: compiler-tag ;
            // currently supported values are vc10-x86 and vc10-x64
            // and mingw-x86
            //... we'll add more compilers in the future.
 
    /* optional -- only used if this project has dependencies on others
                -- may be specified mutiple times */
    uses: bld-cfg="..\path" ;
            // bld-cfg is the build configuration in dependent project
            // the 'blg-cfg=' part can be omitted to depend on the default
            // path is to the root path of the dependent project that 
            // contains a COPKG\.buildinfo file.
            // DOES NOT currently pull in the dependent project from Git
 
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

### 8. Once you have the .buildinfo file complete, you can run the pTk 
tool from the command line (make sure you're in the root of the project). 

**You should be able to run a build: ** 



{% highlight bat %}

C:\forks\libjpeg>ptk build
 
CoApp Project pTk Version 1.0.2.906 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp portingToolkit for porting apps
-------------------------------------------------------------------------------
   
    ( build happens here ... )
 
Project Built.
 
C:\forks\libjpeg>

{% endhighlight %}

 ... and a clean :  

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
