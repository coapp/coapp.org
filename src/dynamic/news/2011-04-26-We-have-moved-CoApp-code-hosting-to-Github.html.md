---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: We've moved CoApp code hosting to GitHub
tags: ['developer','coding']
---

Just a quick update today - we've moved the source repositories for CoApp from [Launchpad](https://launchpad.net/coapp) to [GitHub](https://github.com/coapp).

While I liked a lot of the things about Launchpad, the website is feeling slower and slower some days, and Bazaar, while offering the features that I like, isn't getting the attention (and developer resources) that Git is. Combined with the fantastic innovation happening at GitHub, it's undeniably the go-to place for open source development these days.

And, having done some recent tests with git on Windows, it's clear that it's stable and feature rich enough for all my purposes.

## Updated for use on Github

The following is the instructions on how to build the current CoApp bits:

- You need to have the following tools installed in order to build CoApp:
    
	- Visual Studio 2010 (I'm told that VS 2010 Express will work)    
	- [Windows SDK 7.0](http://www.microsoft.com/download/en/details.aspx?id=8279) or higher    
	- [Windows WDK 7.1](http://www.microsoft.com/download/en/details.aspx?id=11800)
	- [msysgit](http://code.google.com/p/msysgit/) - [Git for Windows 1.7.4](http://code.google.com/p/msysgit/downloads/detail?name=Git-1.7.4-preview20110204.exe) or higher. (This is a command line Git client - there are also other GUIs available.) 
	- [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) (& Pageant) - get the putty-0.60-installer.exe
    
<span class="label warning">Warning</span> I had issues with the SSH client in msysgit; you may need to run the command (assuming that Plink is installed in your `PATH` somewhere):
    
``` text
C:\coapp> SET GIT_SSH=PLINK.EXE
```

- Create and account for GitHub.

- Run Pageant, load your private key.

- Download the following script: [coapp-src.cmd](https://github.com/downloads/fearthecowboy/coapp/coapp-src.cmd)

- Unzip the script into your working directory (where you want to check out the source to)

- From the command line:
    
``` text
C:\coapp> coapp-src
 
  Usage:
  ------
  coapp-src.cmd [OPTION]
 
  where [OPTION] is one or more of:
 
      core        - just the core projects to build the package manager
      gui         - the prototype work on the GUI client
      tools       - the developer and publisher tools
      guts        - the guts of the bootstrap and installershim
      other       - garrett's other tools and oddities
      all         - all of the above
 
      update      - merges updates for any projects that are already checked out.
 
   You can check out a portion of the code (or all, if you want) by using the script:
 
  C:\coapp> coapp-src core
```

It will check out just the core (coapp-cli, coapp-toolkit and coapp-solution).


- Open the coapp-solution\coapp-tools.sln solution file in Visual Studio 2010.

If you didn't get all of the projects, you'll see an error when visual studio tries to load projects that are not checked out; this is ok, you can ignore the error (or delete the projects that are missing from your solution file).

- Build it. (CTRL-SHIFT-B)

Make sure you build the debug version, you won't be able to build the release (you'd need my private cert, and it does some funky stuff during the build process).

- The output will be in [root]\output\any\debug\bin:

@[Dir listing](output-any-debug-bin-dir.png)

And you should be able to run the coapp.exe in that directory:

@[Dir listing](coapp-list-packages.png)



You'll notice the packages that I installed from the http://coapp.org website are installed.

All CoApp binaries (except for the bootstrapper itself) are built as 'any' (meaning they will run 64bit on x64 systems, and 32bit on x86  systems).