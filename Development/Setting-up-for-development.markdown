---
layout: development
subtitle: Setting Up for Development
---
## Development with CoApp 

Development falls into one of two categories:

**CoApp Tool developer** - Building the tools that make up the CoApp platform.


**Package Developer/Maintainer.** -


## Tool Setup  
1.  Visual Studio 2010 (the [express](http://www.microsoft.com/express/Downloads/)
version will do).  
It is recommended that you do a default install-it's known to workdefault install

2. The [Windows SDK 7.1](http://download.microsoft.com/download/A/6/A/A6AC035D-DA3F-4F0C-ADA4-37C8E5D34E3D/winsdk_web.exe).

2. Git (or Mercurial with hg-git)

3. 


## Setting up accounts
2. [An account on github](https://github.com/signup/free), and the ability to check stuff in (you can use [msysgit](http://code.google.com/p/msysgit/) or [tortoisegit](http://code.google.com/p/tortoisegit/) , or any other git client for Windows even the [Mercurial](http://mercurial.selenic.com/downloads/) plugin [hg-git](http://hg-git.github.com/), which lets you use git repositories as if they were mercurial repositories. *(Note: I tried the hg-git plugin, and had to use the version [here](https://github.com/sampsyo/hg-git) to get it to work)*



5. A current build of the CoApp tools. You can [compile them yourself](http://fearthecowboy.com/2011/04/26/weve-moved-coapp-code-hosting-to-github/), or just download my [latest snapshot build](http://cdn.coapp.org/files/coapp-tools-snapshot.zip). Make it easy on yourself, put them in a folder that's in the %PATH%.
 


###Becoming a package maintainer
The first thing is to get yourself added as a CoApp package-maintainer on github no worries, signing up for this isn't a lifelong commitment. If you are interested in keeping it moving over the long haul, that's great, but even if you can just do up a few projects and get them checked in, we'll figure out the long term maintenance strategy later.

In order to get added to the package maintainer group you can send me a message on github (fearthecowboy) or via [email](mailto:garretts@microsoft.com), or heck, even just send me a [tweet](http://twitter.com/home?status=Hey%2C+%40fearthecowboy%21+I%27d+like+to+become+a+%23CoApp+package+maintainer.+My+github+id+is+...). All I need is your github account id, and I'll add you to the group.

 

###Wait! Before You Begin...
Since shallow-forking is intended to continually merge in changes from upstream, please keep changes to the project and its files to an absolute minimum don't do any unnecessary changes, don't reorganize the files, and don't try to rebuild a 'cleaner' build process.  You only need to get it to the point where it builds a viable output.  As we progress, we'll capture the data from the process and build shiny new project files that are much nicer expending extra effort now doesn't get you anywhere.

 

###If you run into trouble, and need help
Check on IRC #coapp on freenode.net (try the [webclient](http://webchat.freenode.net/) if you don't have IRC installed) if I'm there, I'm more than willing you help you thru the steps (and fix stuff that needs fixing), or failing that on the [mailing list](https://launchpad.net/~coapp-developers).
