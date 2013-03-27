---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: The long awaited "Just what the heck *are* you doing?" post...
docid: "news:20130327"
tags: ['news']
---

Howdy!

I've been heads down working on stuff for a while now, and I'm finally to a point that I think I can safely share what's going on, just where exactly we are, and what you can now play with. I didn't expect that it would take this long to get to this point, but like my pappy says <b>"<i>life can be kinda like a mule--sometimes it does what you're expectin' for so long, you forget that sooner or later, it don't like that</i>" ... </b> 

Regardless, I think we're finally gettin' back on track.  

### Aligning ourselves with the most-popular library package manager
A few months back, I mentioned that we were altering our goals a bit, most notably to fit inside this global community.  

After taking a long hard look at NuGet--most notably, its great Visual Studio integration and its rather massive uptake--we made the decision to try to unify these aspects of development on Windows, rather than attempt to fracture them further.  Working closely with the NuGet and Visual Studio teams, we figured out what needed to be changed in order to support NuGet-style packages for native libraries.

#### How hard can that be?
.NET languages share code amongst themselves as `assemblies` -- files that contain the linker metadata, the referential information (what functions are in the file, and what parameters they need), dependency information, and finally, the executable code itself--all wrapped up in a single file.  NuGet leveraged all that, and did all the heavy lifting for transporting collections of those assemblies around, and wiring up the references.

Native Libraries (C/C++) on the other hand, are far more complex to share and consume. Even just the wide variety of files that are necessary to share (.h/.hpp, .lib, .dll, doc files, etc...) make it challenging to package up and move around. Worse yet, in order to **use** a library that someone else produces, you need to at the very minimum do a ton of tweaks to the consumer's project file to add in directories to search when `#include`ing header files, sometimes additional `#defines` are required, which `.lib` files to link with, and how to get the redistributable `.dll` files into the output folder. 

##### Compounding the problem 
Solving that in a flexible and reusable way is difficult enough, but then you have the pile of straw that breaks the horse's back--for a given library, you have many, *many*, **many** ways to pivot on variants of that library:

|Pivot| |Typical variants|
|Platform| |x86, x64, IA64, ARM, Any|
|Linkage| |Dynamic, Static, Side-By-Side, LTCG* ...|
|Compiler/Toolset| |VC6, (VC7, VC8), VC9, VC10, VC11, GCC, ...|
|Threading| |Multi-threaded, Single-threaded...|
|Configuration| |Release, Debug, Optimized...|
|AppType/Subsystem| |Console,Windows,Win8AppStore,Driver...|

Yeah, sure, not every library has every variant of every pivot. But it's clear that enough do that we'd better make sure that library publishers can arbitrarily create variants for every different way of packaging their library. 

##### Where the meek get pinched, and the bold survive.
After going around in a few circles, it turns out that the changes to NuGet that we needed weren't all that big--the secret sauce for *how* NuGet can tell a consuming project where to get the instructions on **what** to do with an whole pasture full of files, is pretty easy. Allow individual packages to specify an MSBuild file for inclusion into the consuming project--typically these end in `.targets` or `.props` -- regardless what they are called, they can be added to the consuming project fairly trivially, and leverage MSBuild and Visual Studio to wire things up. 

Easy then, right?

Well, except MSBuild files are **terribly** complex. And worse on an order of magnitude for every different pivot you want to support. 

##### Solving for 'X' 
CoApp already started down this path--although our model was to generate fine-grained packages, and try to do a Visual Studio plugin that would try to handle these things.  We had already started shallow-forking libraries to create packages, and had scripted up a hundred or so do to precisely this. We had a tool (Autopackage) that would do all the heavy lifting for generating our packages, starting from a minimal amount of information about what was being packaged up.  

We took a step back and looked at what we needed to produce, and I started working on a whole new Autopackage tool to handle this. We also took the opportunity to look at our tools, and to mainstream them a bit by turning everything into PowerShell cmdlets (which are easy to call from a CMD console, if you're a PowerShell greenhorn like me). 

So, over the course of the last three months, I created an insanely complex data model mapping layer that lets me trivially generate source files for nuget packages (a `.nuspec` file), MSBuild files(`.targets` and `.props`) where all the complex rules for how to handle virtually every situation and every possible thing that a package publisher would need to be able do, all from an extremely simple format (**No XML!**).

> <B>Why not simply extend the `.nuspec` format?</B>
> First of all, the `.nuspec` file is simply *metadata* --essentially a manifest for what's encapsulated in the package file. Given the complexity of everything we needed to do, packagers can't really can't be constrained to such a format, and consumers don't need all of that data when consuming the file.
> &nbsp;
> Second, I'm sorry to say, XML Sucks. XML is OK when you want to have a persistence format that is primarily for programmatic  consumption, and you occasionally want to be able to use it in a human-readable context, but past that, it's absolutely the wrong format for scripts and property files.  I had already devised a file-format/script-format for CoApp tools in the past (the base of which we called `property-sheets`) and found that it was a great way of expressing what we needed. Sure, it's somewhat possible to have used YAML, JSON or some other basic persistence/encoding format, but they lacked some of the advanced expression features that I needed to be able to simply support very complex operations.
> &nbsp;
> Our `property-sheet` format is a distant cousin of CSS -- the original format was essentially a way of describing properties that could be 'applied' to an arbitrary data model in the same way that CSS is applied to HTML.  Three years of tweaking and rewrites and we've got the V3 of property-sheets that has some rather amazing behavior wrapped in a very simple and forgiving language.

## A Sneak Peek at the tool to generate these packages.

We now have initial builds of the PowerShell cmdlets to build NuGet packages.  

### Caveats:

#### This is all pre-release code. Many bugs, and not entirely finished. Please be kind :D

- <B>Currently requires PowerShell 3.0  (which you can get for [Windows 7 here](http://www.microsoft.com/en-us/download/details.aspx?id=34595) ) </B>

- <B>Currently requires a nightly build of NuGet which you can get: http://build.nuget.org/NuGet.Tools.vsix  </B>

- Grab the latest installer from http://downloads.coapp.org/files/CoApp.Tools.Powershell.msi ... I'm constantly updating the build there all of the time, and the latest is always there.

- Lousy Installer -- Until I get to resuming builds of CoApp, the tool is simply an MSI installer, with no UI. Install it, reboot (or kill and restart Explorer -- we updated the PSModulePath, and it doesn't refresh Explorer's copy of the variable until restart) Sorry, I wasn't gonna spend a ton of time on that with CoApp V2 right around the corner.

Once you've got it installed you should be able to start PowerShell and check that it's available:

``` powershell
 # import the package (not really necessary, as it's been placed in the PSMODULEPATH and should auto import)
PS c:\> Import-Module coapp              # Or use the 'ipmo' alias 

PS c:\> Show-CoAppToolsVersion
CoApp Powershell Developer Tools Version: 1.8.55.0
```

It has a poor-man's update facility built in:

``` powershell
PS C:\> Update-CoAppTools
The current version 1.8.55.0 will be replaced with the newer than the version from the web 1.8.66.0.
FYI, the installer can't actually update without killing all the powershell tasks.
If you are running as admin, you can do this automatically with the -KillPowershells switch on this command.
```

Of course, MSI can't update locked files (which are locked if you have PowerShell running), so you have to close your PowerShell windows before the Installer can continue. Or, use the `-KillPowershells` switch, and it will try to kill all the powershell processes for you.

- No Docs. I'm trying to get some docs written, and some examples done. Coming Soon.
If you're desperate, you can check out the current [zlib](https://github.com/coapp-packages/zlib/blob/CoApp/COPKG/zlib.autopkg) and [openssl](https://github.com/coapp-packages/openssl/blob/CoApp/COPKG/openssl.autopkg) examples but I highly recommend you join us on <a href="http://webchat.freenode.net?randomnick=1&amp;channels=CoApp&amp;uio=OT10cnVlJjExPTky11">irc://irc.freenode.net#coapp</a> so you can pelt us with questions.<br/><br/>

The only other command you can use right now is `Write-NuGetPackage`

``` powershell
 # Currently, takes a single parameter.
PS C:\> Write-NuGetPackage -Package someproject.autopkg

```

- Optimized for the happy-path. What's the 'happy-path' ? Things that work. Error messages are still a bit cryptic, and don't always lead you to the answer. Ping me <a href="http://twitter.com/#!/fearthecowboy">on Twitter</a> or <a href="http://webchat.freenode.net?randomnick=1&amp;channels=CoApp&amp;uio=OT10cnVlJjExPTky11">IRC</a> when something goes wrong, and either Tim or I will help you. 

- It's somewhere around a beta build at this point. Generally, it's mostly baked but we're still tweaking and adding to the package format.

## Using native packages 
- <B>Currently requires a nightly build of NuGet which you can get: http://build.nuget.org/NuGet.Tools.vsix </B>

Once you have that installed, I've got a public gallery of the native packages we're building for testing purposes which you can see : http://www.myget.org/gallery/coapp

The actual feed to add to NuGet is : http://www.myget.org/F/coapp/

## A cry for help!

The code is in a state of complexity right now, that I think code contributions would be extremely difficult for someone to do. I'll walk you thru building it if you'd like, but I'm pretty much sure you'll melt your brain if you look too closely at some of my code :D

Even though we're in a barely-beta state at this point, I'd love for people to test it out with some of their native code, and help refine it as we go.

## What I really need however, is some help documenting this stuff

All our docs are going to be on the CoApp site, and are in markdown format.  If you want to help, it's pretty easy to fork the CoApp.org repository and edit the content. See the <a href="/pages/tutorials.html">Tutorials section</a> **Contributing to the CoApp Project**. I'd love some tutorials and reference docs written. 

<hr/>

## More Details:
There is a ton of complexity that I haven't explained or documented yet. I can't promise how fast I can write all of this stuff down, but I'll try to make a dent in it very soon.

### <I>Next Time : What's going on with the rest CoApp then?</I>

#### Garrett ( <a href="http://twitter.com/#!/fearthecowboy">FearTheCowboy</a>)
