---
layout: 'article'
title: 'ptk' 
version: '1.0'
---

## ptk - The Porting Toolkit

**pTk** works uses CoApp's [common command line conventions](/reference/cli.html) as well as uses an input file based on the CoApp [common property sheet](/reference/propertysheet.html)

#### Purpose

**pTk** is designed to automate the build process of virtually anything.  

By providing a consistent method for checking out and building any given software project, pTk makes it significantly simpler to offer automated build services, and in the future, using automated tools to improve the quality of a given build of a project, as well as transforming project builds from one compiler to another.

Additionally, it allows developers to specify the development environment (ie, needs a particular SDK) without having resort to a lot of complicated batch commands.

pTk doesn't **change** the existing build process, it merely wraps it so that any given project can always be built with the same command as any other, regardless if it has a batch file, makefile, visual studio project or whatever crazy machinations it takes to build something.


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
### Option [showtools](!showtools) 
### Option [load](!load) 
### Option [mingw-install](!mingw) 
### Option [msys-install](!msys) 

### Action [build](!build) 
### Action [clean](!clean) 
### Action [status](!status) 
### Action [verify](!verify) 
### Action [trace](!trace) 
### Action [list](!list) 

### Parameter [buildconfiguration](configuration»)
