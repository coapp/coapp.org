---
layout: 'article'
title: 'AutoPackage' 
version: '0.1'
---
<div class="alert-message warning">
    <p>This is a draft document -- send feedback to hanrahat@microsoft.com</p>
</div>
## Automated Package Creation

#### Purpose

**AutoPackage** is designed to automate the CoApp package creation process.  It allows you to define the build options you want to control and lets you determine the number and types of packages you create for a particular software component.  For example, if you're building a library component, you can choose to create a dynamic link, static link or standard call (stdcall) variant of the package, or you can choose to create all three.  You can choose to create the packages targeted to Win32, x64 or ARM platforms, or all three.  This document gives examples of the AutoPackage scripts you need to write in order to manage the package creation process.

#### Overview

You control the AutoPackage tool through a set of "cascading" scripts. The scripts are "cascading" in the sense that CoApp provides a base script that AutoPackage implicitly includes and you provide additional scripts that further direct the creation process.  The AutoPackage scripts are identified with the extension .autopkg.

**Property Sheets (PS)** is a domain-specific language (DSL) that CoApp created for writing AutoPackage scripts.  It is similar to [Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets), but the semantics are customized to meet the specific needs of package creation.  The property sheet semantics are illustrated in the examples shown throughout this document.  See [property sheets](http://www.coapp.org/reference/overview.html) for more information about the language itself.

<h4 id="AutoPackage Nodes">AutoPackage Nodes</h4>

Within an AutoPackage script, you define nodes that let you specify the build options for the packages you create.  These build options, which we also refer to as "pivots" or "pivot points," let you specify things like the version of the Visual C or C++ compiler you want to build with and the architecture of the platform you want to target.  Following are some of the nodes that are defined by default for AutoPackage:

* Toolset - specifies which version of Visual Studio to use: v110 == VS 2012, v100 == VS 2010, etc.
* Platform - specifies the target architecture: Win32 x86 for example
* Configuration - specifies whether to produce a "release" or "beta" version of the product
* Linkage - specifies the format in which to create a library: dynamic, static, or stdcall
* CallingConvention - specifies the calling convention to use for x86 targets: stdcall or cdecl for instance
* Files - specifies the file name/location for output

AutoPackage lets you automatically create multiple versions of a package, each version with a unique pivot.   This docmument uses the creation of zlib packages as an example of how the creation process works.  Later you'll see that twelve different variations of the zlib package are created based on the combination of build options specified.  For instance, one of the packages is built using Visual C 2012, targeted for a Win32 (x86) platform and formatted as a dynamic link library, and another one is built using Visual C 2012, targeted for an x64 platform and formatted as a dynamic link library, and so on.  

AutoPackage node definitions are the mechanism that give you control over the creation process.


#### Base AutoPackage Script

The base AutoPackage script (base.autopkg) sets the default properties for package creation across the complete range of build options.  It is implicitly loaded by AutoPackage.

``` text
// Implicitly loaded template script for Autopackage
// This file is automatically imported into Autopackage to set the defaults 

#defines { 
    ElementId = "";
    condition = ${ElementId};
}

configurations {
	Toolset { 
		key : "PlatformToolset"; 
		choices: { v110, v100, v90, v80, v71, v70, v60, gcc };  
	};
    
	Platform {
		key : "Platform"; 
		choices: { Win32, x64, ARM, AnyCPU };
        Win32.aliases : { x86, win32, ia32, 386 };
        x64.aliases : { x64, amd64, em64t, intel64, x86-64, x86_64 };
        ARM.aliases : { arm, woa };
        AnyCPU.aliases : { anycpu, any };
	};

	Configuration {
		key : "Configuration"; 
		choices: { Release, Debug };
	};

	Linkage { 
		choices : { dynamic, static, ltcg, sxs };
		description = "Which version of the .lib file to link to this library";

		ltcg.description = "Link Time Compiler Generation";
		dynamic.description = "Dynamic Library (DLL)";
		static.description = "Static";
		sxs.description = "Side-by-Side";
	};

    // Only really applicable to x86
	CallingConvention {
		choices : { cdecl, stdcall, fastcall, thiscall, clrcall };
		description = "Calling convention model to use (for x86 only)";
		cdecl.description = "cdecl";
		stdcall.description = "stdcall (Uncommon)";
		fastcall.description = "fastcall (Rare)";
		thiscall.description = "thiscall (Rare)";
		clrcall.description = "clrcall (Rare)";

		stdcall.restricted-to = "Win32";
		fastcall.restricted-to = "Win32";
		thiscall.restricted-to = "Win32";
		clrcall.restricted-to = "Win32";
	};
}

nuget {
 	// built-in defines 
	#defines { 
    
        framework      = native,
    
		content_root   = \content\${framework},
		tools_root     = \tools\${framework},
		lib_root       = \lib\${framework},
        build_root     = \build\${framework},
        
		d_include   = ${build_root}\include\${condition},
		d_docs      = ${build_root}\docs\${condition},
		d_bin       = ${build_root}\bin\${condition},  
		d_lib       = ${build_root}\lib\${condition},

		// since the generated msbuild props/targets files are always in a directory two 
		// deep from the package root.
		pkg_root    = $(MSBuildThisFileDirectory)..\..\,
	};
	
    // #options { 
    //    implict-redist = true; 
    //    implict-rules = true;
    // }
   
    // one of the pivots for the targets/props []  parameter.
    #output-packages {
        default : ${pkgname};
        redist : ${pkgname}.redist;
    }

	files {
		bin += {  
            #output-package = redist;
			#auto-copy : true;
            #destination : ${d_bin};  
        };

        lib += { 
            // #output-package = default;
			#auto-link : true;
            #flatten = true;
            #destination = ${d_lib}; 
        };

        include += { 
            // #output-package = default;
			#auto-include : true;
            #destination : ${d_include}; 
        };

		docs += { 
            // #output-package = default;
            #destination : ${d_docs};   
        };
	};
    
    
    targets {
        @alias Includes = ItemDefinitionGroup.ClCompile.AdditionalIncludeDirectories;
        @alias Defines = ItemDefinitionGroup.ClCompile.PreprocessorDefinitions;
        @alias Libraries = ItemDefinitionGroup.Link.AdditionalDependencies;
    }
    
    props {
        @alias Includes = ItemDefinitionGroup.ClCompile.AdditionalIncludeDirectories;
        @alias Libraries = ItemDefinitionGroup.Link.AdditionalDependencies;
        @alias Defines = ItemDefinitionGroup.ClCompile.PreprocessorDefinitions;
    }
}

```
<br>
#### User-Defined AutoPackage Scripts

To complete the AutoPackage process for a particular software component you must provide one or more component-specific scripts.  Following is the AutoPackage script we used to build the zlib library.  It's a good example of the semantics and syntax you need to use in order to generate packages intended for distribution through the NuGet repository.

As mentioned in <a href="#AutoPackage Nodes">AutoPackage Nodes</a>, the following zlib example specifies that twelve different variations of the zlib package be created, each based on a different combination of build options.  The first variation specified for the package is built using Visual C 2012, targets the Win32 (x86) platform and is formatted as a dynamic link library.  This specification is defined by the condition [Win32,v110,dynamic].  The second package variation is built using Visual C 2012, targets an x64 platform and is formatted as a dynamic link library.  This variant is specified by the condition [x64,v110,dynamic].  The remaining ten variations are defined in a similar fashion.

``` text

@import "version.inc";

nuget {
	// the nuspec file metadata. Gets created/updated on build
	nuspec {
		id = zlib;
		version : ${package-version};
		title: ZLib compression library;
		authors: { "Jean-loup Gailly", "Mark Adler", "Garrett Serack", "Tim Rogers" };
		owners: Garrett Serack;
		licenseUrl: "http://zlib.net/zlib_license.html";
		projectUrl: "http://github.com/coapp-packages/zlib";
		iconUrl: "http://zlib.net/images/zlib3d-b1.png";
		requireLicenseAcceptance:false;
		summary:A zlib library;
		description: @"A native zlib library.
		zlib homepage:  http://zlib.net";
		releaseNotes: "Release of zlib 1.2.7 libraries.";
		copyright: Copyright 2013;
		tags: { zlib, native, coapp,  };
	};
    

	// the files that go into the content folders
	// (inserted into the nuspec file)
	files {
		include: { ..\zlib.h, ..\zconf.h };

		docs: {  ..\doc\**\* };
    
		[Win32,v110,dynamic] { 
			lib: { ..\output\vc11\x86\release\lib\zlib1.lib };
			bin: { ..\output\vc11\x86\release\bin\zlib1.dll };
		}

		[x64,v110,dynamic] {
			lib: { ..\output\vc11\x64\release\lib\zlib1.lib };
			bin: { ..\output\vc11\x64\release\bin\zlib1.dll };
		}
		
		[Win32,v110,static] {
			lib: { ..\output\vc11\x86\release\lib\zlibstat.lib };
		}

		[x64,v110,static] {
			lib: { ..\output\vc11\x64\release\lib\zlibstat.lib };
		}

		[Win32,v110,stdcall] {
			lib: { ..\output\vc11\x86\release\lib\zlibwapi.lib };
			bin: { 
                // #output-package = redist;
            ..\output\vc11\x86\release\bin\zlibwapi.dll };
		}

		[x64,v110,stdcall] {
			lib: { ..\output\vc11\x64\release\lib\zlibwapi.lib };
			bin: { ..\output\vc11\x64\release\bin\zlibwapi.dll };
		}

		[Win32,v100,dynamic] { 
			lib: { ..\output\vc10\x86\release\lib\zlib1.lib };
			bin: { ..\output\vc10\x86\release\bin\zlib1.dll };
		}

		[x64,v100,dynamic] {
			lib: { ..\output\vc10\x64\release\lib\zlib1.lib };
			bin: { ..\output\vc10\x64\release\bin\zlib1.dll };
		}
		
		[Win32,v100,static] {
			lib: { ..\output\vc10\x86\release\lib\zlibstat.lib };
		}

		[x64,v100,static] {
			lib: { ..\output\vc10\x64\release\lib\zlibstat.lib };
		}

		[Win32,v100,stdcall] {
			lib: { ..\output\vc10\x86\release\lib\zlibwapi.lib };
			bin: { ..\output\vc10\x86\release\bin\zlibwapi.dll };
		}

		[x64,v100,stdcall] {
			lib: { ..\output\vc10\x64\release\lib\zlibwapi.lib };
			bin: { ..\output\vc10\x64\release\bin\zlibwapi.dll };
		}
	};

	// the VC++ .targets file that gets generated and inserted into the ${d_content} folder
    targets {
		// every configuration needs to reference the include directories.
		Includes += ${pkg_root}${d_include};
		Defines += HAS_ZLIB;
        
        [static]
        Defines += ZLIB_WINAPI;
        
        [stdcall]
        Defines += ZLIB_WINAPI;
	};
}

``` 
<br>
You can find examples of AutoPackage scripts for other software components built by the CoApp community in the GitHub repository  <a href="https://github.com/organizations/coapp-packages/">coapp-packages</a>.
<br> 

<!----------------------------------------------------------------------------------
#### Command Line Help

``` text
Outercurve Foundation XXXX Version 1.1.1.1 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp xxxxx
-------------------------------------------------------------------------------

Usage:
-------

xxxx [options] 

    Options:
    --------
    «--help«/reference/cli.html#help»                      this help 
    «--nologo«/reference/cli.html#nologo»                    don't display the logo
    «--load-config=<file>«/reference/cli.html#loadconfig»        loads configuration from <file>
    «--verbose«/reference/cli.html#verbose»                   prints verbose messages

```

### Option [foo](!foo) 
----------------------------------------------------------------------------------------->
