---
layout: 'article'
title: 'Building the CoApp Toolkit'
version: 1.0
docid: 'developer:buildtoolkit'
---

### Requirements
You need to make sure that you've [checked out the source code for the project][developer:sourcecode].

### Building

#### Building from the command line. (Or, if you only have Visual Studio Express)

If you only have Visual Studio express, you can't build C++ and C# projects in the same solution, so if you want to be able to rebuild the entire project you can do that from the command line using the [ptk tool](reference:ptk) (which is included in the `ext\tools` submodule for you).

``` bat
cd coapp 

tools\ext\ptk build release 
```

pTk will then build the entire project.


#### Building from the Visual Studio. 

You can just open one of the `.SLN` files in Visual Studio.


> `coapp.sln` -- contains the projects without the tricky-to-build prerequisites (native dlls and bootstrappers) -- *only Visual C# Express 2010 or better* is required.

or 

> `coapp-with-prerequisites.sln` -- contains the projects **with** the tricky-to-build prerequisites (native dlls and bootstrappers) -- *Visual Professional 2010 or better* is required.

It is not recommended that you use this project, the prerequisite DLLs must be digitally signed to work correctly (which is why the signed copies are shipped in the ext/binaries submodule)

