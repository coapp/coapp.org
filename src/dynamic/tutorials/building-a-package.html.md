---
layout: 'article'
title: 'How to Build a Package' 
version: '1.0'
---

## Overview

This tutorial tells you how to set up a CoApp build environment and how to create NuGet packages for your libraries and other software components.

<h3 id="Requirements">Requirements</h3>

The requirements to produce native NuGet packages using CoApp are as follows:

* Windows Vista, Windows 7, or Windows 8
	- You need these or later versions of Windows because you need Visual Studio 2012 and PowerShell 3.0
* Visual Studio 2012 or 2010 
* PowerShell 3.0 
	- Windows 8 - Installed by default
	- Windows 7 or Windows Vista - Install from http://www.microsoft.com/en-us/download/details.aspx?id=34595
* NuGet 2.5 or later  
	- 2.5 Release Candidate : https://nuget.codeplex.com/releases/view/104451
	- Install the Visual Studio Integration component (V6)
* CoApp PowerShell Tools
	- Beta : http://downloads.coapp.org/files/CoApp.Tools.Powershell.msi
* Optional:
	- Notepad++ : http://notepad-plus-plus.org/download/v6.3.2.html
	- Language File : http://downloads.coapp.org/files/autopackage.xml


### AutoPackage

AutoPackage is the CoApp tool you use to create native NuGet packages.  You get AutoPackage when you install the "CoApp PowerShell Tools" described above in <a href="#Requirements">Requirements</a>.  AutoPackage is a PowerShell module.  It contains Powershell cmdlets that you can use from either the command line or batch files.  The primary cmdlet used in this tutorial is:

``` powershell
	Write-NuGetPackage
```

### Installing the package

Installation is simple -- as long as you have PowerShell 3.0 installed, just download and run the [CoApp PowerShell tools MSI installer](http://downloads.coapp.org/files/CoApp.Tools.Powershell.msi).

<div class="alert-message block-message success">
    <p><b>First Time Installation Issue</b><br/>
	One quick issue: When the installer runs the first time, Windows Installer doesn't always refresh the environment variables like it should.
	
	To make sure that the <code>PSMODULEPATH</code> environment variable is correctly set for new PowerShell console Windows, you either have to: reboot,<br><br>
	
	<b>Or,</b> force Explorer.EXE to reload the environment, (and thereby avoiding a reboot) by opening a PowerShell console and running the following:
	
	<div style="white-space: pre; line-height: 1; background: #FFFFFF; "><span style="font-family: Consolas;font-size: 10pt;color: #008000;"># Forces Explorer.exe to realize the environment has changed.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">
</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">[</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">System</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">Environment</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">]::</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">SetEnvironmentVariable</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">(</span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"PSMODULEPATH"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">[</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">System</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">Environment</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">]::</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">GetEnvironmentVariable</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">(</span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"PSMODULEPATH"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"User"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">)</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"User"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">)</span></div>
	<br>Then, close that PowerShell Window, and open a new one. 
	<br>This step is not needed on updates.
	
	<br><br>Once we switch to using the CoApp package manager to ship the tools, this issue will go away.
	</p>
</div>


### Updating the tools to the latest version
Once you have the CoApp PowerShell tools installed, you can update to the latest stable version:

``` powershell
Update-CoAppTools -KillPowershells

```

Or update to the latest beta version:

``` powershell
Update-CoAppTools -KillPowershells -Beta

```


### AutoPackage Scripts (.autopkg)

Input to Write-NuGetPackage is an AutoPackage script that you must provide.  AutoPackage scripts are written in a 'PropertySheet' domain-specific language similar to [Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets).  Refer to the [AutoPackage Script Format](http://www.coapp.org/reference/packagescript.html) in the Reference tab of [CoApp.org](http://www.coapp.org/pages/reference.html) for a complete description of AutoPackage scripts.

Together, AutoPackage and AutoPackage scripts greatly simplify the package creation process by handling most of the complexity involved.  The package creation process using AutoPackage is developer friendly and requires *no* XML file editing.

## A Tutorial - Packaging the C++ REST SDK

The C++ REST SDK provides a good example to demonstate the packaging process using CoApp.  First step is to download and unpack the source code for the SDK, which you can find at 

	http://downloads.coapp.org/files/CPP_Rest_SDK_Example.zip

When you've finished the unpacking process, you'll see that the SDK comes in three variants one each for Visual Studio 2010, Visual Studio 2012 and the Windows Store Apps.

``` text
C:\project> dir

	Directory of C:\project
	
04/22/2013  02:05 PM    <DIR>          CppRESTWindowsSDK
04/22/2013  02:05 PM    <DIR>          Microsoft Cpp REST SDK for VS 2010
04/22/2013  02:05 PM    <DIR>          Microsoft Cpp REST SDK for VS 2012
```

Traverse down any of the variants and you'll find large numbers of header and library files.  AutoPackage's reason for being is to manage all of these components for you during the packaging process.

### Creating the AutoPackage Script

The first thing we need to do is create the AutoPackage script.  Use your editor and begin with two simple nodes.  First the *nuget* node.  This is our high-level node that defines everything we put into our NuGet package.  The second is the *nuspec* node.  *Nuspec* is the designation that the NuGet project uses to specify all of the metadata needed to build and manage a package.

``` css
nuget{
	nuspec{
	
	}
}
```

	
#### Nuspec Metadata

Now, let's begin filling in the metadata we need to define for the project. First we need to include basic information including identification (name, version), links (project, license, etc), description, summary, icon, and so on.

``` css
	nuspec {
		id = cpprestsdk;
		version : 0.6.0.7;
		title: C++ REST SDK;
		authors: {Microsoft Corporation};
		owners: {CoApp Project, Garrett Serack};
		licenseUrl: "http_://www.apache.org/licenses/LICENSE-2.0";
		projectUrl: "https_://casablanca.codeplex.com/";
		iconUrl: "https_://download-codeplex.sec.s-msft.com/Download?ProjectName=casablanca&DownloadId=630102&Build=20425";
		requireLicenseAcceptance:false;
		summary:Casablanca is your toolbox for accessing and authoring connected applications using modern C++ features and best practices. ;
	
		/* if you need to span several lines you can prefix a string with 
		 an @ symbol (exactly like c# does). */
		
		description: @"This library is a Microsoft effort to support cloud-
		based client-server communication in native code using a modern 
		asynchronous C++ API design.

		The C++ REST SDK (codename ""Casablanca"") is a project to start 
		exploring how to best support C++ developers who want to take 
		advantage of the radical shift in software architecture that cloud 
		computing represents.

		This library also gives you a convenient model for composing 
		asynchronous operations. Whether your application is compute-
		intensive or I/O-driven, its scalability is likely to require 
		careful resource utilization. Asynchronous APIs are great for 
		scalability, but can be very hard to use when all you have is 
		C-level functionality. Fortunately, C++ 11 offers a whole new 
		set of capabilities that can make dealing with asynchronous 
		operations easy, and the library takes advantage of that throughout.
		";
		releaseNotes: "Release of C++ Rest SDK 0.6 libraries.";
		copyright: Copyright 2013;
		tags: { REST, Casablanca, native, CoApp };
	};
```


A few things are worth noting in this early version of the AutoPackage script.  First, quotes around strings are not necessary unless the string contains a comma or a semicolon. So, the following assignment is a valid alternative to the one in the example:

``` css
	licenseUrl: http_://www.apache.org/licenses/LICENSE-2.0;
```


Second If you need to write a string the extends more than a single line, use the @" .... "; string literal.  And finally, make sure you identify your package as *native* code as opposed to *managed* code. You do this by including "native" in the *tag* node definition as shown in the example.  Making this designation helps users find your libraries more easily.

#### Pivots - How to Handle Variations in Packages

Now that we've defined all of the basic metadata needed for the project, let's look at the complexity that is inherent in creating native packages.  Almost all C/C++ libraries have many flavors depending on a large set of factors, such as the platforms you intend to target, whether you're building a debug or production release, what toolset you're targeting and so on.  The following list shows some of the variables, that we refer to as *pivots*.

	* Platform : x86, x64, Arm ...
	* Configuration : Debug, Release
	* Toolset: VC11, VC10, VC9, ... VC6
	* Linkage: dynamic, static, LTCG, SxS
	* Calling Convention: cdecl, stdcall
	* Application Type: Win8, Win8 phone, Desktop ...
	* Character Set : UTF8, UTF16, Unicode ... 
	
Let's look at a few of these pivots more closely.  Linkage, for example: you can specify whether you want your output library to be a dynamic link type, which is a popular format, static, which is useful for some things, Link-Time Compiler Generated (LTCG), which is useful for improving performance using Profile-Guided Optimization, or Side-by-Side (SxS).  Calling conventions are used less commonly now, but sometimes libraries are packaged using cdecl, stdcall or both.  Application types include Windows 8 Server, Windows 8 Phone, and a variety of desktops.  The point is, you can define as many pivots as you need to provide the widest usefulness of your packages.
	
The list of pivots is not a finite set, so AutoPackage is designed to let you define however many nodes you need to cover all the pivots of your particular packages.  Just define all the nodes you need, specify the conditions for each build (i.e., what combination of pivot values to use), and AutoPackage handles everything else.

You can see the commonly handled configurations [in the AutoPackage reference](http://coapp.org/reference/autopackage-ref.html#Pivots)

#### Specifying Package Contents

The *files* node is what lets you specify the contents of your packages.  So let's take a look at the AutoPackage script to see where the *files* node fits in the scheme of things.

``` css
nuget(
	nuspec{
		...
	}
	
	files {
		...
	}
}
```

	
You can see that it resides at the same level as the *nuspec* node.  Where *nuspec* specifies the metadata for the NuGet packages, the *files* node specifies the contents.  Now let's fill in the build variables we want to use to create our C++ REST SDK packages.

The `files` node is what lets you make sure all of your files are placed in the correct location, for example, all of your header files, all of your binaries, they all need to go into the correct location at the time of build and deployment.

First, we'll define some location macros that will make the script more readable and easier to work with.  With these macros, we're identifying that we want to create packages for the three SDKs supported by C++.  Remember, these are the Windows Store App, the Visual Studio 2010 and the Visual Studio 2012 SDKs.


``` css
	// the files that go into the content folders
	files {

		#defines {
			SDK_RT   = CppRESTWindowsSDK\0.6\redist\;
			SDK_2010 = Microsoft Cpp REST SDK for VS 2010\SDK\;
			SDK_2012 = Microsoft Cpp REST SDK for VS 2012\SDK\;
		}
	}
```

		
Now let's gather all of the include files we need to conduct our builds.  With some investigation, you'll see that the include files for all three SDKs are the same, so we only need to specify one of them.

``` css
	// grab all the files in the include folder
	// the folder that contains all the .h files will 
	// automatically get added to the Includes path.
	include: { "${SDK_2010}include\*" };
```


In this case, all of the header files are located in the *include* directory itself.  If they had been organized in folders underneath the *include* directory, you would need to specify this using '**' as shown in the following example:

``` css
	include: { "${SDK_2010}include\**\*" };
```


If your project uses header files from multiple locations, you can also specify this in the *include* node as follows:

``` css
	include: { "${SDK_2010}include\*", foo.h, c:\test\foo.h };
```

However, for this tutorial, none of these additional designations is neccessary.

Now, let's add a node to specify what documentation to include with the release:

``` css
	// Documents that we want to ship with the package. 
	docs: {  ${SDK_2012}license.rtf };
```
	
Next, we need to define the specific conditions for which we want to build. Here's where we return to the concept of *pivots*. For this example, let's start to build our packages to be deployed on x64 platforms, using the Visual Studio 2010 toolset and let's make our output a "debug" release for the project.  These three conditions are the *pivots* for our first package.  The following code example shows how to do this.  Note that the variables $(Platform), $(PlatfromToolset), $(Configuration) shown in the initial comment correspond to environment variables used by Visual Studio and are not used directly in this script.

``` css
	// these declarations of lib, symbols and bin folders only apply
	// to the project when:
	//		$(Platform) == x64
	//		$(PlatformToolset) == v100 
	//		$(Configuration) == Debug 
	[x64,v100,debug] { 
		// files in the lib collection are automatically 
		// added to the AdditionalLibraries in the link stage.
		lib: ${SDK_2010}lib\x64\Debug\casablanca100.lib;
		
		// files in the symbols collection are added to the 
		// symbols package 
		symbols: ${SDK_2010}bin\x64\Debug\casablanca100.pdb;
		
		// files in the bin directory are put in the redist package
		// and copied to the output folder at build time.
		bin: ${SDK_2010}bin\x64\Debug\casablanca100.dll;
	}
```


In the above segment, the conditional statement is defined by the line:

``` css
	[x64,v100,debug]
```

For this particular configuration, you can then set the locations for where to store the library, symbols and binary files for the package you're creating.  In this example, we're instructing AutoPackage to ensure that the library file `${SDK_2010}lib\x64\Debug\casablanca100.lib` is stored in the proper lib directory.  The same is true for the symbols file, which can later by uploaded to a symbols server, and the binary DLL file.

Let go ahead now and specify all the remaining configurations for the Visual Studio 2010 family of packages.  This means creating pivots for all the combinations of platforms and releases that can be built by Visual Studio 2010.

``` css
	[x64,v100,release] { 
		lib: ${SDK_2010}lib\x64\Release\casablanca100.lib;
		symbols: ${SDK_2010}bin\x64\Release\casablanca100.pdb;
		bin: ${SDK_2010}bin\x64\Release\casablanca100.dll;
	}
	
	[x86,v100,debug] { 
		lib: ${SDK_2010}lib\x86\Debug\casablanca100.lib;
		symbols: ${SDK_2010}bin\x86\Debug\casablanca100.pdb;
		bin: ${SDK_2010}bin\x86\Debug\casablanca100.dll;
	}	

	[x86,v100,release] { 
		lib: ${SDK_2010}lib\x86\Release\casablanca100.lib;
		symbols: ${SDK_2010}bin\x86\Release\casablanca100.pdb;
		bin: ${SDK_2010}bin\x86\Release\casablanca100.dll;
	}
```

Now let's do the same thing for all of the Visual Studio 2012 builds.  Note in these examples that we've added the *desktop* pivot value which is for desktop (i.e., non-Windows RT) applications.  The difference here is that under Visual Studio 2010, building for Windows RT isn't an option.  The compilations are by default for the desktop.  With Visual Studio 2012, you now have the choice of building for either the desktop or for Windows RT.

``` css		
	[x64,v110,debug,desktop] { 
		lib: ${SDK_2012}lib\x64\Debug\casablanca110.lib;
		symbols: ${SDK_2012}bin\x64\Debug\casablanca110.pdb;
		bin: ${SDK_2012}bin\x64\Debug\casablanca110.dll;
	}
	
	[x64,v110,release,desktop] { 
		lib: ${SDK_2012}lib\x64\Release\casablanca110.lib;
		symbols: ${SDK_2012}bin\x64\Release\casablanca110.pdb;
		bin: ${SDK_2012}bin\x64\Release\casablanca110.dll;
	}
		
	[x86,v110,debug,desktop] { 
		lib: ${SDK_2012}lib\x86\Debug\casablanca110.lib;
		symbols: ${SDK_2012}bin\x86\Debug\casablanca110.pdb;
		bin: ${SDK_2012}bin\x86\Debug\casablanca110.dll;

	}
	
	[x86,v110,release,desktop] { 
		lib: ${SDK_2012}lib\x86\Release\casablanca110.lib;
		symbols: ${SDK_2012}bin\x86\Release\casablanca110.pdb;
		bin: ${SDK_2012}bin\x86\Release\casablanca110.dll;
	}
```

Now that we've covered all of the desktop builds we can do the same for Windows RT, as you can see in the following script segment.
		
``` css
	[arm,v110,debug,winrt] {
		bin: ${SDK_RT}Debug\arm\casablanca110.winrt.dll;
		symbols: ${SDK_RT}Debug\arm\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\arm\Debug\casablanca110.winrt.lib;
	}
	
	[x64,v110,debug,winrt] {
		bin:${SDK_RT}Debug\x64\casablanca110.winrt.dll;
		symbols:${SDK_RT}Debug\x64\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\x64\Debug\casablanca110.winrt.lib;
	}
	
	[x86,v110,debug,winrt] {
		bin:${SDK_RT}Debug\x86\casablanca110.winrt.dll;
		symbols:${SDK_RT}Debug\x86\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\x86\Debug\casablanca110.winrt.lib;
	}			
	
	[arm,v110,release,winrt] {
		bin:${SDK_RT}Retail\arm\casablanca110.winrt.dll;
		symbols:${SDK_RT}Retail\arm\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\arm\Release\casablanca110.winrt.lib;
	}
	
	[x64,v110,release,winrt] {
		bin:${SDK_RT}Retail\x64\casablanca110.winrt.dll;
		symbols:${SDK_RT}Retail\x64\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\x64\Release\casablanca110.winrt.lib;
	}
	
	[x86,v110,release,winrt] {
		bin:${SDK_RT}Retail\x86\casablanca110.winrt.dll;
		symbols:${SDK_RT}Retail\x86\casablanca110.winrt.pdb;
		lib:${SDK_2012}lib\x86\Release\casablanca110.winrt.lib;
	}
```

	
So now we've covered all of the variants we can handle for the set of pivot points: `platform`, `toolset`, `configuration` and `target application type`. 

The final piece we want to add to the file is a *targets* node.  For now that only includes a definition that can be used later to help software pick up what it actually needs.  This will be covered in a later tutorial, so just include this node for now.

``` css
	nuget{
		nuspec{
		...
		}
		
		files{
		...
		}
	
		targets {
			// We're trying to be standard about these sorts of thing. 
			// (Will help with config.h later :D)
			Defines += HAS_CPPRESTSDK;
		}
	}
```


This completes creation of the AutoPackage script for the C++ REST SDK packages.

####Producing the Outputs

In the process we're following for this tutorial, three packages get generated. 

* `Main` package - contains source files, headers, binaries and is used by developers
* `Redist` package - contains binaries and are used by developers and those who are installing packages
* `Symbols` package - contains symbol information and is used by developers for debugging

To produce the package use the command from a PowerShell prompt:

``` powershell
	Write-NuGetPackage .\cpprestsdk.autopkg
```
	
where cpprestssdk.autopkg is the script you've just written.  The resulting output follows:

``` text
>C:\project> Write-NuGetPackage .\cpprestsdk.autoconfig
> Attempting to build package from 'cpprestsdk.autoconfig'
> Successfully created package 'C:\project\cpprestsdk.0.6.0.7.nupkg
> Attempting to build package from 'cpprestsdk.redist.nuspec\
> Successfully created package 'C:\project\cpprestsdk.redist.0.6.0.7.nupkg
>
> Attempting to build package from 'cpprestsdk.symbols.nuspec'
> Successfully created package 'C:\project\cpprestsdk.symbols.0.6.0.7.nupkg

C:\project> dir

04/22/3013  02:05 PM		    259769 cpprestsdk.0.6.0.7
04/22/2013  02:05 PM             5,786 cpprestsdk.autopkg
04/22/2013  02:05 PM		   5260255 cpprestsdk.redist.0.6.0.7.nupkg
04/22/2013  02:05 PM           6045737 cpprestsdk.symbols.0.6.0.7.nupkg
04/22/2013  02:05 PM    <DIR>          CppRESTWindowsSDK
04/22/2013  02:05 PM    <DIR>          Microsoft Cpp REST SDK for VS 2010
04/22/2013  02:05 PM    <DIR>          Microsoft Cpp REST SDK for VS 2012
```

These .nupkg files are all just zip file that you can uncompress to see their contents.

####Consuming NuGet Packages

Consuming NuGet packages from Visual Studio is straightforward:

1) Click on "Manage NuGet References"
2) Choose the packages you want to consume
3) Start coding

Let's go through the steps together and create a Win32 console application.  Begin by starting a new project in Visual Studio and call it "TestApp."  Now, go to your Solution Explorer on the right-hand side of your screen and open "Manage NuGet References."  You'll only see this if you're running NuGet 2.5 or later as stated in the <a href="#Requirements">Requirements</a> section of this document.

@[Menu Item](/images/tutorials/menu_item.png)
	
Go to the online section and have it search different packages sources.  Choose the C++ REST SDK package.  On the right-hand side of your screen, you'll see all of the text we added to the AutoPackage script.

@[C++ Rest SDK Package](/images/tutorials/manage_packages.png)
	
Include the package into your project.  You'll see that NuGet handles any dependencies you'll need, in this case the *redist* package.  Close that window, which will take you back to your coding window.  Next drop the following code into you workspace.  It's the source from one of the examples from the SDK itself.

``` c
	/***
	* ==++==
	*
	* Copyright (c) Microsoft Corporation. All rights reserved. 
	* Licensed under the Apache License, Version 2.0 (the "License");
	* You may obtain a copy of the License at
	* http://www.apache.org/licenses/LICENSE-2.0
	* 
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	** you may not use this file except in compliance with the License.
	 limitations under the License.
	*
	* ==--==
	* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
	*
	* bingrequest.cpp - Simple cmd line application that makes an HTTP GET request to Bing and outputs
	*       the resulting HTML response body into a file.
	*
	* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	****/

	#include <http_client.h>
	#include <filestream.h>

	using namespace utility;
	using namespace web::http;
	using namespace web::http::client;
	using namespace concurrency::streams;

	#ifdef _MS_WINDOWS
	int wmain(int argc, wchar_t *args[])
	#else
	int main(int argc, char *args[])
	#endif
	{
		if(argc != 3)
		{
			printf("Usage: BingRequest.exe search_term output_file\n");
			return -1;
		}
		const string_t searchTerm = args[1];
		const string_t outputFileName = args[2];

		// Open a stream to the file to write the HTTP response body into.
		auto fileBuffer = std::make_shared<streambuf<uint8_t>>();
		file_buffer<uint8_t>::open(outputFileName, std::ios::out)
			.then([=](streambuf<uint8_t> outFile) -> pplx::task<http_response>
		{
			*fileBuffer = outFile; 

			// Create an HTTP request.
			// Encode the URI query since it could contain 
			// special characters like spaces.
			http_client client(U("http://www.bing.com/"));
			return client.request(methods::GET, uri_builder(U("/search"))
				.append_query(U("q"), searchTerm).to_string());
		})

		// Write the response body into the file buffer.
		.then([=](http_response response) -> pplx::task<size_t>
		{
			printf("Response status code %u returned.\n", response.status_code());

			return response.body().read_to_end(*fileBuffer);
		})

		// Close the file buffer.
		.then([=](size_t)
		{
			return fileBuffer->close();
		})

		// Wait for the entire response body to be written into the file.
		.wait();

		return 0;
	}
```

Notice that Visual C++ is not complaining about missing references like `http_client`.  Such references are resolved automatically through external dependencies.  Click on the *external dependencies* link on the right-hand side of your screen and you see all of the references that have been included from the C++ REST SDK package that we created.  We didn't have to set up anything manually it was all set up by the package itself and it set it up for the conditions under which we are compiling, namely, `Win32` and `debug`.  If you have a special set of includes that only works for one set of conditions, they will be there.

Now select *Build*.  Once your build is complete, *cd* to the output directory and look at the files.  

@[Menu Item](/images/tutorials/output_dir_listing.PNG)

You can see the file TestApp.exe and the library `casablanca110.dll`.  This means that the package did the "right thing" and made sure the appropriage DLL was in our build directory.  That happened because the following line in our AutoPackage script made sure this version of the DLL was properly stored:

``` css
	bin: ${SDK_2012}bin\x86\Debug\casablanca110.dll;
```


And the next line from our AutoPackage script made sure we linked against the correct library.

``` css
	lib: ${SDK_2012}lib\x86\Debug\casablanca110.lib;
```
	
Now, let's test the program.  Enter the command:

``` text
	c:\project> TestApp "coapp" Test.html
```

This tells TestApp to search for the term "coapp" and store the result in the file `Test.html`.

Finally, run the command:

``` text
	c:\project> explorer .\Test.html
	
```

	Show search results
		
You see that the search results returned by TestApp represent a valid search output that includes CoApp.org and other references to *coapp* and that the display is being pulled from the file we told TestApp to create, namely *Test.html*.

This demonstrates that we were able to build, compile, link and run a program all without ever having to look at the Visual Studio project files and without having to modify any of the properties by hand including not having to specify a source directory, library files, or include directories.  All we relied on was the contents of the package and everything worked.

####Looking Under the Covers

If you're curious you can see how the process works.  Go back to the TestApp directory and cd to the *packages* directory.  Show its contents, then drill down through the *build* directory to the *native* directory.

``` text
C:\project> dir

04/22/3013  02:15 PM		    259769 cpprestsdk.0.6.0.7
04/22/2013  02:15 PM		   5260255 cpprestsdk.redist.0.6.0.7
04/22/2013	02:15 PM			 118 repositories.config

C:\project> cd cppreststk.0.6.0.7
C:\project> dir

04/22/2013	02:15 PM    <DIR>		build
04/22/3013  02:15 PM		    259765 cpprestsdk.0.6.0.7.nupkg
04/22/2013  02:15 PM		      1984 cpprestsdk.0.6.0.7.nuspec

C:\project> cd build
C:\project> dir

04/22/2013	02:15 PM    <DIR>		native
04/22/3013  02:15 PM		       686 configurations.autopkg

C:\project> cd native
C:\project> dir

04/22/2013	02:15 PM    <DIR>		docs
04/22/2013	02:15 PM    <DIR>		include
04/22/2013	02:15 PM    <DIR>		lib
04/22/3013  02:15 PM		       906 cpprestsdk.properti3sui-01cfd1c2-96fd-43da-94ca07db3a30.xml
04/22/3013  02:15 PM		       527 cpprestsdk.0.6.0.7.props
04/22/2013  02:15 PM		      9679 cpprestsdk.0.6.0.7.targets
```

Use your editor to look at *cpprestsdk.0.6.0.7.targets* to see the complexity that AutoPackage has managed for you.


``` xml
<?xml version="1.0" encoding="utf-8"?>
<Project  ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003" InitialTargets="init">
  <PropertyGroup
    Label="Default initializers for properties">
    <Linkage-cpprestsdk_redist
      Condition="'$(Linkage-cpprestsdk_redist)' == ''">dynamic</Linkage-cpprestsdk_redist>
    <CallingConvention-cpprestsdk_redist
      Condition="'$(CallingConvention-cpprestsdk_redist)' == ''">cdecl</CallingConvention-cpprestsdk_redist>
  </PropertyGroup>
  <ItemGroup
    Label="x64 and v100 and Debug"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Debug'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v100\Debug\casablanca100.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="x64 and v100 and Release"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Release'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v100\Release\casablanca100.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v100 and Debug"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Debug'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v100\Debug\casablanca100.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v100 and Release"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Release'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v100\Release\casablanca100.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="x64 and v110 and Debug and Desktop"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'Desktop'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Debug\Desktop\casablanca110.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="x64 and v110 and Release and Desktop"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'Desktop'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Release\Desktop\casablanca110.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v110 and Debug and Desktop"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'Desktop'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Debug\Desktop\casablanca110.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v110 and Release and Desktop"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'Desktop'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Release\Desktop\casablanca110.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="ARM and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'ARM' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\ARM\v110\Debug\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="x64 and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Debug\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Debug\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="ARM and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'ARM' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\ARM\v110\Release\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="x64 and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Release\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <ItemGroup
    Label="Win32 and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'">
    <None
      Include="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Release\WinRT\casablanca110.winrt.dll"
      Condition="'$(TargetApplicationType)' == 'WinRT'">
      <DeploymentContent>true</DeploymentContent>
    </None>
  </ItemGroup>
  <Target
    Name="cpprestsdk_redist_AfterBuild"
    AfterTargets="AfterBuild" />
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v100_and_Debug"
    Label="x64 and v100 and Debug"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Debug'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v100\Debug\casablanca100.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v100_and_Release"
    Label="x64 and v100 and Release"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Release'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v100\Release\casablanca100.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v100_and_Debug"
    Label="Win32 and v100 and Debug"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Debug'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v100\Debug\casablanca100.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v100_and_Release"
    Label="Win32 and v100 and Release"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v100' And '$(Configuration)' == 'Release'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v100\Release\casablanca100.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v110_and_Debug_and_Desktop"
    Label="x64 and v110 and Debug and Desktop"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'Desktop'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Debug\Desktop\casablanca110.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v110_and_Release_and_Desktop"
    Label="x64 and v110 and Release and Desktop"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'Desktop'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Release\Desktop\casablanca110.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v110_and_Debug_and_Desktop"
    Label="Win32 and v110 and Debug and Desktop"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'Desktop'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Debug\Desktop\casablanca110.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v110_and_Release_and_Desktop"
    Label="Win32 and v110 and Release and Desktop"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'Desktop'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Release\Desktop\casablanca110.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_ARM_and_v110_and_Debug_and_WinRT"
    Label="ARM and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'ARM' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\ARM\v110\Debug\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v110_and_Debug_and_WinRT"
    Label="x64 and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Debug\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v110_and_Debug_and_WinRT"
    Label="Win32 and v110 and Debug and WinRT"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Debug' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Debug\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_ARM_and_v110_and_Release_and_WinRT"
    Label="ARM and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'ARM' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\ARM\v110\Release\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_x64_and_v110_and_Release_and_WinRT"
    Label="x64 and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'x64' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\x64\v110\Release\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <Target
    Name="cpprestsdk_redist_AfterBuild_Win32_and_v110_and_Release_and_WinRT"
    Label="Win32 and v110 and Release and WinRT"
    Condition="'$(Platform)' == 'Win32' And '$(PlatformToolset)' == 'v110' And '$(Configuration)' == 'Release' And '$(TargetApplicationType)' == 'WinRT'"
    AfterTargets="cpprestsdk_redist_AfterBuild">
    <Copy
      SourceFiles="$(MSBuildThisFileDirectory)..\..\build\native\bin\Win32\v110\Release\WinRT\casablanca110.winrt.dll"
      DestinationFolder="$(TargetDir)"
      SkipUnchangedFiles="true" />
  </Target>
  <UsingTask
    TaskName="cpprestsdk_redist_Contains"
    AssemblyFile="$(MSBuildToolsPath)\Microsoft.Build.Tasks.v4.0.dll"
    TaskFactory="CodeTaskFactory">
    <ParameterGroup>
      <Text
        Output="false"
        ParameterType="System.String" />
      <Library
        Output="false"
        Required="true"
        ParameterType="System.String" />
      <Value
        Output="false"
        Required="true"
        ParameterType="System.String" />
      <Result
        Output="true"
        ParameterType="System.String" />
    </ParameterGroup>
    <Task>
      <Code>Result = ((Text ?? "").Split(';').Contains(Library) ) ? Value : String.Empty;</Code>
    </Task>
  </UsingTask>
  <Target
    Name="init">
    <cpprestsdk_redist_Contains
      Text="Linkage-dynamic"
      Library="cpprestsdk_redist"
      Value="dynamic"
      Condition="'$(Linkage-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="Linkage-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="Linkage-static"
      Library="cpprestsdk_redist"
      Value="static"
      Condition="'$(Linkage-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="Linkage-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="Linkage-ltcg"
      Library="cpprestsdk_redist"
      Value="ltcg"
      Condition="'$(Linkage-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="Linkage-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="Linkage-sxs"
      Library="cpprestsdk_redist"
      Value="sxs"
      Condition="'$(Linkage-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="Linkage-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="CallingConvention-cdecl"
      Library="cpprestsdk_redist"
      Value="cdecl"
      Condition="'$(CallingConvention-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="CallingConvention-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="CallingConvention-stdcall"
      Library="cpprestsdk_redist"
      Value="stdcall"
      Condition="'$(CallingConvention-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="CallingConvention-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="CallingConvention-fastcall"
      Library="cpprestsdk_redist"
      Value="fastcall"
      Condition="'$(CallingConvention-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="CallingConvention-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="CallingConvention-thiscall"
      Library="cpprestsdk_redist"
      Value="thiscall"
      Condition="'$(CallingConvention-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="CallingConvention-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
    <cpprestsdk_redist_Contains
      Text="CallingConvention-clrcall"
      Library="cpprestsdk_redist"
      Value="clrcall"
      Condition="'$(CallingConvention-cpprestsdk_redist)'==''">
      <Output
        TaskParameter="Result"
        PropertyName="CallingConvention-cpprestsdk_redist" />
    </cpprestsdk_redist_Contains>
  </Target>
</Project>
```
	
	
This is a Visual Studio properties file and you can see that AutoPackage has taken care of a lot of detail you never need to worry about.  All you need to do is use it.

####What's Next?

Look for additional tutorials soon covering:

* Uploading packages 
* Deep dive into how it works
* Creating/using dependencies
* Customizing targets/props files
* Advance scenarios
