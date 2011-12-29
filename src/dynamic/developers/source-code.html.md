---
layout: 'article'
title: 'Checking Out the Source Code' 
version: '1.0'
docid: 'developer:sourcecode'
---
### Requirements
You'll need the following in order to correctly set up your development environment for working on CoApp:

- **Git, putty, and a github account** -- see [Getting setup with git and github](/developers/git.html)
- **Development environment** -- see [Setting up the development environment](/developers/development-environment.html)


### The CoApp source repositories

The majority of CoApp is placed in two source repositories:

   **CoApp** - The [Core CoApp Engine/Toolkit](http://github.com/coapp/coapp) -- this is the code for the core CoApp engine, including the code that bootstraps the CoApp Engine when a package is installed.
   
   **Devtools** - The [CoApp Developer Tools](http://github.com/coapp/devtools) -- this contains the source code for the all developer tools (including autopackage, simplesigner, etc). This includes the tools that are used by developers and publishers to build shallow forks, create packages, and sign binaries (plus more!).

There are three [submodules](http://book.git-scm.com/5_submodules.html) found in the `ext` folder ( `binaries`, `tools` and `libraries`) in both of these projects that contain the shared binary files between the projects (so you *could* just check out the Devtools project and build it without actually having to check out the engine, even though there are dependencies between them.)

### Checking out the source code from github

#### CoApp

The git repository for the CoApp project is found at :  `git@github.com:coapp/coapp.git`

From the developer command prompt, you can run the following:

``` bat
REM Assuming that you want to work in the c:\project\ folder:

c:\> mkdir c:\project
c:\> cd c:\project

c:\project\> git clone --recursive  git@github.com:coapp/coapp.git 

```

It will run for a bit (it takes time to do the initial checkout):

When it's done you will see something like:

@[Checking out the source code with git](/images/tutorials/source-code-1.png)

#### Devtools

The git repository for the devtools project is found at :  `git@github.com:coapp/devtools.git`

Check it out in a similar way (and right beside the `coapp` project)

``` bat

c:\> cd c:\project

c:\project\> git clone --recursive  git@github.com:coapp/devtools.git 

```

And it should look something like:

@[Checking out the source code with git](/images/tutorials/source-code-2.png)


You now have the code, and are [ready to build some code!][developer:buildtoolkit]