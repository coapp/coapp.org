---
layout: 'article'
title: 'ptk - The Porting Toolkit' 
version: '1.0'
docid: 'reference:ptk'
---
## ptk - The Porting Toolkit

**pTk** uses CoApp's [common command line conventions][reference:cli] as well as uses an input file based on the CoApp [common property sheet][reference:propertysheet]

#### Purpose

**pTk** is designed to automate the build process of virtually anything.  

By providing a consistent method for checking out and building any given software project, pTk makes it significantly simpler to offer automated build services, and in the future, using automated tools to improve the quality of a given build of a project, as well as transforming project builds from one compiler to another.

Additionally, it allows developers to specify the development environment (ie, needs a particular SDK) without having resort to a lot of complicated batch commands.

pTk doesn't **change** the existing build process, it merely wraps it so that any given project can always be built with the same command as any other, regardless if it has a batch file, makefile, visual studio project or whatever crazy machinations it takes to build something.

#### Functionality

By default, pTk searches the `copkg` folder of the current directory to find the .buildinfo file, which it then loads performs the command given on the command line (build, verify, clean, status, etc).

#### Command Line Help

``` text
Outercurve Foundation pTk  Version 1.1.2.1252 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp portingToolkit for porting apps
-------------------------------------------------------------------------------

Usage:
-------

pTK [options] action [buildconfiguration...]

    Options:
    --------
    «--help«/reference/cli.html#help»                      this help 
    «--nologo«/reference/cli.html#nologo»                    don't display the logo
    «--load-config=<file>«/reference/cli.html#loadconfig»        loads configuration from <file>
    «--verbose«/reference/cli.html#verbose»                   prints verbose messages

    «--rescan-tools«#rescantools»              rescan for tool paths
    «--show-tools«#showtools»                prints the path of the tools

    «--load=<file>«#load»               loads the build ptk buildinfo
                                defaults to .\COPKG\.buildinfo

    «--mingw-install=<path>«#mingw»      specifies the location of the mingw install
    «--msys-install=<path>«#msys»       specifies the location of the msys install

    Actions:
        «build«#build»                   builds the product

        «clean«#clean»                   removes all files that are not part of the
                                project source

        «status«#status»                  shows any files present that should not be

        «verify«#verify»                  ensures that the product source matches the
                                built and cleaned

        «trace«#trace»                   performs a build using CoApp Trace to gather
                                build data

        «list«#list»                    lists availible builds from buildinfo

    «[buildconfiguration]«#configuration»        optional; indicates the builds from the
                                buildinfo file to act on. Defaults to all



```

### Option [rescan-tools](!rescantools) 
Forces pTk to rescan for all the location of all tools and sdks on the system.


### Option [showtools](!showtools) 
Dumps the location where of the tools and SDKs is found on the system.

### Option [load](!load) 
Loads a specific .buildinfo file from the given path.

### Option [mingw-install](!mingw) 
Since the location of the mingw tools may be difficult to locate programatically, you may pass the root folder of its location as `--mingw-install=<path>`.

By default it searches for directories matching `c:\M*` (and program files) for the mingw tools, and works out the location of the tools within.

### Option [msys-install](!msys) 
Since the location of the mingw tools may be difficult to locate programatically, you may pass the root folder of its location as `--msys-install=<path>`.

By default it searches for directories matching `c:\M*` (and program files) for the mingw tools, and works out the location of the tools within.

### Action [build](!build) 
Runs the automation steps to build the given configuration.  

Defaults to building all the configurations

### Action [clean](!clean) 
Runs the automation steps to clean all temporary and generated files from the source folder.

This should restore everything back to the same state that the source was checked out from Git in.

### Action [status](!status) 
Checks to see if the current state is identical to the state the code was checked out from Git.

### Action [verify](!verify) 
Runs clean, build, verify on the given configuration.  

Defaults to running thru all the configurations

### Action [trace](!trace) 
Runs build on the configuration, tracing the build with CoApp trace. 

Defaults to running thru all the configurations

### Action [list](!list) 
Lists the build configurations in the .buildinfo file

### Parameter [buildconfiguration](configuration)
You may pass the desired configuration on the command line (or multiple configurations). 

Accepts wildcards.

If this is not passed, it assumes `*` -- all configurations.

### .buildinfo file format

pTk .buildinfo files are based on the [common property sheet format][reference:propertysheet].

The .buildinfo file consists of a `#product-info` rule, which contains the costmetic information about a given project, along with one or more build configuration rules, each which details how to build and clean a given build configuration.


##### product-info Rule
``` c#
// .buildinfo file example
«#product-info«#productinfo»  {
    «product-name«#productname»: "";
    «version«#version»: "";
    «original-source-location«#originalsourcelocation»: "";
    «original-source-website«#originalsourcewebsite»: "";
    «license«#license»: "";
    «packager«#packager»: "";
}

name {
    «default«#default»: true or false; // default is true by default :)
    «set«#set»: true or false; // for setting environment variables
    
    «platform«#platform»: compiler-tag ;/* optional -- defaults to x86 */
    «compiler«#compiler»: compiler-tag; /* optional -- defaults to vc10 */
    «sdk«#sdk»: sdk-tag;                /* optional -- defaults to sdk7.1 */
 
    «uses«#uses»: cfg="..\path" ;
            /* optional -- only used if this project has dependencies on others-may be specified mutiple times */
               
           
    «targets«#targets»: { ... } ;
            // a comma seperated list of the binary files that are output 
            // that are of significance
 
    «build-command«#buildcommand»: "";
            // either a single command line, or a batch script 
            // that has the commands to build the targets listed above.
 
    «clean-command«#cleancommand»: "";
            // either a single command line, or a batch script 
            // that has the commands to remove all temporary files 
            // created during a build.
}
```


#### .buildinfo [#product-info](!productinfo)
The `#product-info` rule contains cosmetic information that may be used later to assist in packaging up the binaries of the project, and is present to assist maintainers on understanding where the source code originally came from.

##### .buildinfo [#product-info/product-name](!productname)
The `product-name` property reflects the name of the project being compiled.

Example:

``` c#
    product-name: "libjpeg"; // the name of the project is "libjpeg"
```   
##### .buildinfo [#product-info/version](!version)
The `version` is the original project version of the source code.

Example:

``` c#
    version: "8c"; // the version of the project is "8c" 
```   

##### .buildinfo [#product-info/original-source-location](!originalsourcelocation)
The `original-source-location` is the repository or tarball location of the source code 

Example:

``` c#
    original-source-location: "http://ijg.org/files/jpegsr8c.zip"; // the source was downloaded from there
```   
##### .buildinfo [#product-info/original-source-website](!originalsourcewebsite)
The `original-source-website` is the human-readable website where the developer can go for more information

Example:

``` c#
    original-source-website: "http://ijg.org"; // the jpeg website
```   

##### .buildinfo [#product-info/license](!license)
The `license` refers to the license the source code is licensed under

Example:

``` c#
    license: "Custom license, see README"; // not a gpl/bsd/etc...
```   

##### .buildinfo [#product-info/packager](!packager)
The `packager` refers to the individual who is currently maintaining this source code

Example:

``` c#
    packager: "Rafael Rivera <rafael@withinwindows.com>"; // blame him!
```   


#### .buildinfo [build configuration](!configuration)
A "**build bonfiguration**" is analogous to a build configuration with Visual Studio You can create builds for x86, x64, as well as for different flavors (static library vs. dynamic library) etc. 
> It's not necessary to explicitly create multiple build configuration for x86 and x64 if project compiles well under both without different commands (save for the selection of which platform).   

You **do** want multiple configurations when the steps change between platforms (or you know that different files get processed in some libraries, there are separate files for x86 vs. x64), or if you have different expected outputs i.e. some libraries allow you to generate a static and a dynamic version of the same library).  Generally speaking, err on the side of caution and don't create multiple build configurations excessively for projects that behave themselves, we'll autogenerate the alternate configurations when we get around to creating new Visual Studio projects. 
 
Build configuration names should be composed of alphanumeric characters (plus dashes and underscores). It is recommended that they are kept simple and follow some kind of standard. 
> TODO : Perhaps we should set this standard down somewhere?

##### .buildinfo [configuration/default](!default)
The `default` property can be used to turn off a build configuration from building by default (good for turning off shared or dependent tasks).

Permitted Values:
>    `true` -- by default, it will build (the default)
>    `false` -- will not build unless explicitly used (or used from a 'uses' statement)

##### .buildinfo [configuration/set](!set)
The `set` property is used to set an environment variable for a given build. Persists thru to the child builds as well.

Example:
``` c#
   set: cfg="Debug";  // now cfg is set to Debug 
```

##### .buildinfo [configuration/platform](!platform)
The `platform` property refers to target platform that this configuration is building for.
Permitted values:
>    `x86` -- for Windows 32 bit, x86 builds
>    `x64` -- for Windows 64 bit, x64 builds (ie, amd64, EMT64, etc)

##### .buildinfo [configuration/compiler](!compiler)
The `compiler` refers to the c/c++ compiler configuration to use to compile files with.

Permitted values:
>    `vc10`- Visual Studio 2010 
>    `vc9` - Visual Studio 2008
>    `vc8` - Visual Studio 2005
>    `vc7.1` - Visual Studio 2003
>    `vc7` - Visual Studio 2002 
>    `vc6` - Visual Studio 98 (VC6)
>    `sdk7.1` - Windows SDK 7.1 C++ compiler
>    `sdk7` - Windows SDK 7.0 c++ compiler (untested)
>    `sdk6` - Windows SDK 6.0 c++ compiler (untested)
>    `mingw` - mingw compiler  

##### .buildinfo [configuration/sdk](!sdk)
The `sdk` refers to the SDK to build with.

Permitted Values:
>   `sdk7.1` - Windows SDK 7.1 
>   `sdk7` - Windows SDK 7.0
>   `sdk6` - Windows SDK 6.0
>   `feb2003` - Platform SDK Feb2003 -- last known version that works with VC6
>   `wdk7600` - Windows driver kit build 7600 (Windows 7 version)

##### .buildinfo [configuration/uses](!uses)
This is for specifying that another build must precede this one. The `uses` property has a key and a value.

The Key (`cfg`) is the name of the build configuration in the target project's .buildinfo file
The Value (`"..\foo"`) is the relative directory for the project to build. You can specify the current directory if the build configuration is in the current project. (ie, `uses: common=".\"`)

If only the value is specified (ie, `uses: x86;`) it will look up the buildconfiguration in the use the .buildinfo file.

**Note: DOES NOT currently pull in the dependent project from Git**
 
##### .buildinfo [configuration/targets](!targets)
The `targets` property lists the relative paths to the generated files that indicate that a successful build has completed.

Example:
``` c# 
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
```

##### .buildinfo [configuration/build-command](!buildcommand)
The `build-command` is the command or script that needs to be executed to build the targets

Any command or commands can be specified as necessary. (if it's a batch script, make sure you use the at-symbol @"" string literal)

Example:

``` c#
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
```


##### .buildinfo [configuration/clean-command](!cleancommand)
The `clean-command` is the command or script that needs to be executed to clean any files out to restore the working directory to the pristine state.

Any command or commands can be specified as necessary. (if it's a batch script, make sure you use the at-symbol @"" string literal)

Example:

``` c#
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
```


#### Macro Values 
Use of `${macro}` style macros will look up the value in the current environment. These values can be set using the [set](#set) property.
