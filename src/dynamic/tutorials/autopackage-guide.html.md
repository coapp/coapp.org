---
layout: 'article'
title: 'AutoPackage' 
version: '0.1'
---
<div class="alert-message warning">
    <p>This is a draft document -- send feedback to hanrahat@microsoft.com</p>
</div>
## Automated Package Creation

#### Overview

**AutoPackage** is designed to automate the CoApp package creation process.  It allows you to define the build options you want to control and lets you determine the number and types of packages you create for a particular software component.  For example, if you're building a library component, you can choose to create a dynamic link, static link or standard call (stdcall) variant of the package, or you can choose to create all three.  You can choose to create the packages targeted to Win32, x64 or ARM platforms, or all three.  This document gives examples of the AutoPackage scripts you need to write in order to manage the package creation process.

AutoPackage scripts are identified with the extension `.autopkg` and follow the **[PropertySheet](http://www.coapp.org/reference/overview.html)** format.


#### AutoPackage Nodes

<div class="alert-message warning">
<span class="label warning">NOTE!</span>  The AutoPackage script format is constantly evolving to include new output formats.  At present all supported formats will be presented on this page, but as this tool evolves, these instructions may be divided into seperate pages according to the desired output.
</div>

##### Implicit AutoPackage Script

There is an implicit AutoPackage script built into the tools which sets the default properties for package creation across the complete range of build options.  It is automatically loaded loaded by AutoPackage before processing on user files begins.

For more detailed information about the implicit script, **[read here](/reference/implicit-packagescript.html)**.

##### Configuration Options / Pivots

A top-level node which is common to all output formats is the `configurations` node, which contains descriptors for file and package variants that may affect the package consumer or have an impact on where files are placed.  There are some defaults defined by the **[implicit AutoPackage script](/reference/implicit-packagescript.html#Configurations)** which should cover a majority of the pivots most packages will need.  Additional pivots may be added as described in the **[AutoPackage Script Guide](/reference/aautopackage-ref.html#Pivots)** if needed.

##### NuGet Packages

The initial and primary output type is NuGet packages.  The design of NuGet packages is such that all supported variations are expected to be included in the same package file.  These packages must also contain a variety of metadata for discoverability and administrative purposes.  In an effort to make doing all of this as painless as possible, particularly for native libraries, all of the file and metadata information can be entered into the `.autopkg` file, from which all defined variations for all necessary output files will be generated in a single action.

A NuGet package's definition is contained in the `nuget` top-level node.  Below we walk through this definition for the common library, `zlib`.  This is just a basic example to show how most of these nodes and definitions work to produce the output packages.

###### NuGet metadata
First the NuGet metadata, which resides in the `nuspec` node:
``` css
	nuspec {
		id = zlib;
		version : ${package-version};
		title: ZLib compression library;
		authors: { "Jean-loup Gailly", "Mark Adler", "Garrett Serack", "Tim Rogers" };
		owners: Garrett Serack;
		licenseUrl: "http_://zlib.net/zlib_license.html";
		projectUrl: "http_://github.com/coapp-packages/zlib";
		iconUrl: "http_://zlib.net/images/zlib3d-b1.png";
		requireLicenseAcceptance:false;
		summary:A zlib library;
		description: @"A native zlib library.
		zlib homepage:  http://zlib.net";
		releaseNotes: "Release of zlib 1.2.7 libraries.";
		copyright: Copyright 2013;
		tags: { zlib, native, coapp,  };
	};
```

For information on appropriate values for these fields, please refer to the **[NuGet documentation](http://docs.nuget.org/docs/reference/nuspec-reference)** on the subject.  Of particular interest to us is the `id`, which determines the default output filenames.

###### Files
The `files` node defines the files to be included in this package.  There are multiple pre-defined collections which should cover the vast majority of needs for NuGet library packages.  These include:

+ source  -  Files in this collection will be added as source files to the `${id}.symbols.nupkg` file.
+ symbols -  These files will be added as debug symbols to the `${id}.symbols.nupkg` file.
+ docs  -  Documentation files.  These are not copied or included in the consuming project, but are made available in the directory tree to which the package is installed.  These are added to the `${id}.nupkg` file.
+ include  -  Files in this collection will be placed into an `include` directory, which will be added to the include path for consuming projects.  These are added to `${id}.nupkg`.
+ lib  -  Link-time library files (typically ending in `.lib`).  These will automatically be added to the linker command line of consuming projects as additional libraries to link with.  These are added to `${id}.nupkg`.
+ bin  -  Binaries or run-time libraries (typically ending in `.dll`).  These will be copied to the output directory of the consuming project after a successful build.  These files are added to the `${id}.redist.nupkg` package.

Additional file collections may be defined (and existing collections may be adjusted or re-defined) in the manner **[described here](/reference/autopackage-ref.html#Files)**.

All of these pre-defined collections can accept both global and condition-specific file specifiers.  A file specifier is simply a string path to the file(s) to include in the collection which may contain wildcards.  File specifiers should relative paths from the location of the `.autopkg` file being processed.  
The following are all perfectly acceptable file specifiers:

+ `..\includes\*.h`
+ `.\docs\**\*`
+ `..\output\v110\x64\Release\MyLib.dll`

Adding files to a collection at a global level means that those files will always be present in and connected to consuming projects regardless of the conditions specified in the consuming project.  This is typically desirable for header files and documentation, which commonly do not change from one set of conditions to another.

An example of global usage:
``` css
    files {
        include += {
            ..\include\*.h,
            ..\include\*.hpp
        }
    };
```

Adding files to a collection at a condition-specific level means that those files will only be connected to consuming projects when those conditions are set in the consuming project.  This is frequently necessary for link-time and run-time libraries, which will differ from one set of build conditions to another.

An example of condition-specific usage:
``` css
    files {
        [Win32,Release] {
            bin += ..\output\Win32\Release\*.dll;
            lib += ..\output\Win32\Release\*.lib;
        }
        [Win32,Debug] {
            bin += ..\output\Win32\Debug\*.dll;
            lib += ..\output\Win32\Debug\*.lib;
        }
        [x64,Debug] {
            bin += ..\output\x64\Debug\*.dll;
            lib += ..\output\x64\Debug\*.lib;
        }
        [x64,Release]  
            bin += ..\output\x64\Release\*.dll;
        [Release, x64]  // This condition is identical to the previous one.
            lib += ..\output\x64\Release\*.lib;
        
    };
```

As evidenced by the example above, the order in which the conditions are specified does not matter and they will be normallized during processing.



###### Project Properties and Targets
The `props` and `targets` nodes are identical in all ways except with regards to when they take effect.  Both of these nodes have a direct impact on projects which consume this package by way of prepending or appending various properties or values into the Visual Studio project file.  These are ideal places to insert any defines that are necessary to properly link with your libraries which have no relavence to other projects.  As a general rule, it is ok to add defines that are specific to this (and **ONLY** this) library, but not ok to include defines that have any purpose outside this library.
In a similar fashion to the `files` node, the `props` and `targets` nodes, the pre-defined collections for these nodes will function properly for both global and condition-specific scopes.

An example from our `zlib.autopkg`:
``` css
    targets {
		Defines += HAS_ZLIB;
        
        [dynamic]
        Defines += ZLIB_DLL;
        
        [stdcall]
        Defines += ZLIB_WINAPI;
	};
```


You can find examples of AutoPackage scripts for other software components built by the CoApp community in our **[GitHub repository](https://github.com/organizations/coapp-packages/)**.

