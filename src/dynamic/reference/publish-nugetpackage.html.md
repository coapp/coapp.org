---
layout: 'article'
title: 'Publish-NuGetPackage Cmdlet' 
version: '1.0'
---

## SYNOPSIS 

Publishes one or more NuGet packages (and their related packages) to a NuGet repository.

## SYNTAX

``` text

Publish-NuGetPackage -Packages <package files> [-ApiKey <key>] [-ConfigFile <path>] [-Timeout <seconds>] [-Repository <URL>] [-SymbolsRepostory <URL>]

```

## DESCRIPTION

Uploads NuGet packages to the NuGet repository. Symbols packages are automatically routed to the symbols repository.  

**PARAMETERS**

**-Packages** *(files)*

Package files to publish. Only specify the base package, the .redist and .symbols packages will be found automatically.

**-ApiKey** *(string)*

The API key for the NuGet server.

**-ConfigFile** *(path)*

The NuGet configuration file. If not specified, file %AppData%\NuGet\NuGet.config is used as configuration file.

**-Timeout** *(string)*

Specifies the timeout for pushing to a server in seconds. Defaults to 300 seconds (5 minutes).

**-Repository** *(string)*

Specifies the symbol server URL. If not specified, nuget.org is used unless DefaultPushSource config value is set in the NuGet config file

**-SymbolRepository** *(string)*

Specifies the server URL. If not specified, https://nuget.gw.symbolsource.org/Public/NuGet is used.

**-Quiet** *<SwitchParameter>*

Suppress output of all non-essential messages

**-Verbose** *<SwitchParameter>*

Prints a lot of extra details about the process. May be useful for debugging.


## RELATED LINKS

Online Help: [http://coapp.org/reference/publish-nugetpackage.html](http://coapp.org/reference/publish-nugetpackage.html)
Report Bugs To: [https://github.com/coapp/coapp.powershell/issues](https://github.com/coapp/coapp.powershell/issues)

