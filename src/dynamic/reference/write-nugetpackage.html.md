---
layout: 'article'
title: 'Write-NuGetPackage Cmdlet' 
version: '1.0'
---

## SYNOPSIS 

Generates one or more NuGet packages from an .autopkg script file.

## SYNTAX

``` text
	Write-NuGetPackage [-Package] <file>.autopkg [-NoClean] [-Quiet] [-NoWarnings]

```
	

## DESCRIPTION

NuGet packages are built from a single .autopkg file that contains information about all the different files and combinations on how those files are to be consumed by the end-developer.

Each .autopkg script can create one or more packages that are related to each other. Typically, for a given library `foolib`, the `foolib.autopkg` file would contain the information and instructions to generate `foolib.nupkg`, `foolib.redist.nupkg` and `foolib.symbols.nupkg`.

The base package (ie, `foolib.nupkg`) contains the instructions and files required to build an application using the package (also called `consuming` the package) and has a dependency on the `foolib.redist.nupkg`) Typically, the base package contains the documentation, header files, .lib files, and anything else a developer would need.

The `redist` package (ie, `foolib.redist.nupkg`) contains the binary files that are required only to run applications linked with the package. Typically, this means the .DLL files, along with any other content that the application will require at runtime. This is separated to make it possible that an intermediate library can link against a package (ie, `barlib` uses functions from `foolib`, but the consumer of `barlib` doesn`t need to explicitly link against `foolib`, or reference its header files.)

The `symbols` package (ie, `foolib.symbols.nupkg` contains the debug symbols (.pdb files) for the binaries found in the `redist` package. The `symbols` package can be uploaded to a symbol server (like symbolsource.org) where developers can access them as required. `Symbols` packages can also contain the original source tree, so that end-developers can actually step thru the source code for libraries that they are linking to. For more detail, see more about symbols packages at http://docs.nuget.org/docs/creating-packages/creating-and-publishing-a-symbol-package .

**PARAMETERS**

**-Package** *<String>* (Required)

Autopackage script file (.autopkg) to generate packages from. See [package script format reference](/reference/packagescript.html).

**-NoClean** *<SwitchParameter>*

Don't clean up intermediate files. This leaves the .nuspec, .xml and other generated files on the disk.

**-NoWarnings** *<SwitchParameter>*

Suppress output of all warning messages.

**-Quiet** *<SwitchParameter>*

Suppress output of all non-essential messages

**-Verbose** *<SwitchParameter>*

Prints a lot of extra details about the package generation process. May be useful for debugging.


## EXAMPLES

#### Sample C++ library (CPPRestSDK)


``` csharp

PS C:> PS C:project> Write-NuGetPackage -Package .cpprestsdk.autopkg

```

``` text
 >:Attempting to build package from 'cpprestsdk.nuspec'.
 >:Successfully created package 'C:projectcpprestsdk.0.6.0.12.nupkg'.
 >:Attempting to build package from 'cpprestsdk.redist.nuspec'.
 >:Successfully created package 'C:projectcpprestsdk.redist.0.6.0.12.nupkg'.
 >:
 >:Attempting to build package from 'cpprestsdk.symbols.nuspec'.
 >:Successfully created package 'C:projectcpprestsdk.symbols.0.6.0.12.nupkg'.
```

Building a simple C++ package.
 The .autopackage script contains the required files to generate the base, redist and symbols packages.
 This example's .autopkg and other files can be found at http://downloads.coapp.org/files/CPP_Rest_SDK_Example.zip

## RELATED LINKS

Online Help: [http://coapp.org/reference/write-nugetpackage.html](http://coapp.org/reference/write-nugetpackage.html)
 Sample .autopkg scripts: [http://coapp.org/reference/sample-autopackage-scripts.html](http://coapp.org/reference/sample-autopackage-scripts.html)
 Detailed Autopackage script reference: [http://coapp.org/reference/packagescript.html](http://coapp.org/reference/packagescript.html)
 Report Bugs To: [https://github.com/coapp/coapp.powershell/issues](https://github.com/coapp/coapp.powershell/issues)


