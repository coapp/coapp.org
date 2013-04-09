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

**AutoPackage** is designed to automate the package creation process.  It allows you to identify the pivot-points you want to control and lets you determine the number and types of packages you create.  For example, you can choose to create dynamic link, static link or standard call (stdcall) library packages, or all three.  You can choose to create packages targeted to Win32, x64 or ARM platforms, or all three.  This document gives examples of the AutoPackage scripts you need to manage the package creation process.

#### Overview

AutoPackage consists of two "cascading" scripts that automate the package creation process. The scripts are "cascading" in the sense that CoApp provides a base script that users can include in their scripts that further direct the creation process.  The AutoPackage scripts are identified with the extension .autopkg.

**Property sheets** is a domain-specific language (DSL) that CoApp created for the writing of AutoPackage scripts.  It is similar to Cascading Style Sheets, but the semantics are customized to meet the specific needs of package creation.  The property sheet semantics are illustrated in the examples shown throughout this document.  See <a href="http://www.coapp.org/reference/overview.html">property sheets</a> for more information.

#### AutoPackage Node Names and Values

AutoPackage recognizes the following node names:

* Nuget - container for Nuget propoerties
* Targets - TBD
* Props - TBD
* Files -TBD
* Configuratons - TBD
* Linkage - TBD
* Platform - TBD
* Configuration - TBD
* Tool set - TBD

#### Base AutoPackage Script

The Base AutoPackage (base.autopkg) consists of two sections. The first section is directly included in all runs of AutoPackage unless explicitly declared otherwise in a file being processed.  Following are the default attribute definitions.

``` text
#defines { condition = """"; }

nuget {
     // built-in defines 
      #defines { 
            d_content   = \content\native,
            d_tools     = \tools\native,
            d_root      = \lib\native,
        
            d_include   = ${d_root}\include\${condition},
            d_docs      = ${d_root}\docs\${condition},
            d_bin       = ${d_root}\bin\${condition},  
            d_lib       = ${d_root}\lib\${condition},
            d_exes            = ${d_tools}\${condition},

            pkg_root    = $(MSBuildThisFileDirectory)..\..\,
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

      files {
        lib: { 
            #flatten : true;
            #destination : ${d_lib}; 
        };
        include: { 
            #destination : ${d_include}; };
            docs: {  
            #destination : ${d_docs}; 
        };
            bin: { 
            #destination : ${d_bin}; 
        };
      };
}

```
The following section is the contents of ‘basic.autopkg.'

``` text

// Basic Platform Configurations 

configurations {
     Platform {
           key : "Platform"; 
           choices: { Win32, x64, ARM, AnyCPU };
     };

     Configuration {
           key : "Configuration"; 
           choices: { Release, Debug };
     };

     Toolset { 
           key : "PlatformToolset"; 
           choices: { v110, v100 };
     };
};

```

#### User-Defined AutoPackage Script

In order to create your own package, you must provide your own package-specific AutoPakcage script.  Following is the AutoPackage script we used to build the zlib library.  It's a good example of the semantics and syntax you need to follow in creating your scripts.

``` text
@import basic.autopkg;
@import @"version.inc";

configurations {
	Linkage {
		// the first choice is the default
		// so, unless a choice is made, it will assume the first choice
		choices: { dynamic, stdcall, static };
	}
};

nuget {
	// the nuspec file metadata. Gets created/updated on build
	nuspec {
		id = zlib;
		version : ${package-version};
		title: ZLib compression library;
		authors: {Jean-loup Gailly, Mark Adler, Garrett Serack, Tim Rogers};
		owners: {CoApp Project, Garrett Serack};
		licenseUrl: "http://zlib.net/zlib_license.html";
		projectUrl: "http://github.com/coapp-packages/zlib";
		iconUrl: "http://zlib.net/images/zlib3d-b1.png";
		requireLicenseAcceptance:false;
		summary:A zlib library;
		description: @"A native zlib library.
	zlib homepage:  http://zlib.net";
		releaseNotes: "Release of zlib 1.2.7 libraries.";
		copyright: Copyright 2013;
		tags: { zlib, native, CoApp };

		// .dependency { id : ...; version : ...; }
		// .dependency { id : ...; version : ...; }
		// .dependency { id : ...; version : ...; }

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
			bin: { ..\output\vc11\x86\release\bin\zlibwapi.dll };
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

	// the VC++ .props file that gets generated and inserted into the ${d_content} folder
	props { 
		// we're going to generate a number of properties anyway. 
        // so even if the packager doesn't specify the props object 
        // we're going to make this file.
	};

	// the VC++ .targets file that gets generated and inserted into the ${d_content} folder
	targets {
		// every configuration needs to reference the include directories.
		Includes += ${pkg_root}${d_include};
		ItemDefinitionGroup.ClCompile.AdditionalDefines += HAS_ZLIB;
	};
}

``` 


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
