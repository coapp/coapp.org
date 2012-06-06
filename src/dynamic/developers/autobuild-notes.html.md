---
layout: 'article'
title: 'CoApp Packages - Notes on using AutoBuild' 
version: '1.0'
docid: 'reference:autobuild-notes'
---
## Notes on packaging with AutoBuild
This document is a set of notes to bear in mind when maintaining a repository intended to be built and published by the CoApp.  We use a very simple automated build system called [AutoBuild](https://github.com/coapp-test/AutoBuild) to build and publish our packages.  Below are documented some of the requirements for a package to be properly built with AutoBuild.

-----

- `ptk package` must run successfully immediately after calling `ptk test`.  The exact command used is `ptk package --built=true`, which may provide a means of skipping the build process if it does not need to be repeated after running tests.

- `ptk package` must increment the version of the package.  Repeated calls of `ptk package` should always produce sets of package files with different versions by default.  An optional switch may be provided (such as `--noversion=true` for example) which may skip the reversioning if present, but the default behaviour of `ptk package` should always increase the version number.

    - By convention, this reversioning normally occurs before autopackage is called to produce the final package files, but following this convention is not manadatory.
    
- Each branch to be packaged must provide one of the following:

    1. A file, `COPKG\version.inc`, which contains the version information of the branch and which is updated upon every default call to `ptk package`.
    
    2. A build target in the `.buildinfo` file named `commit-version`, which will perform a commit of all necessary files to declare the version of the package produced.  This target must add and commit these files, __but must NOT push the commit__.
    
- Each fork/repository to be packaged is assumed, by default, to have a branch named `CoApp` which will be built by the AutoBuild service.  While special exceptions can be made for specific repositories that have need to build multiple branches, any repository having only a single branch to build will only be built from the `CoApp` branch.  Furthermore, any commit to the specified branch(es), other than from the AutoBuild service, __will__ result in that branch being fetched and built.  _Plan your commits and merges accordingly!_
