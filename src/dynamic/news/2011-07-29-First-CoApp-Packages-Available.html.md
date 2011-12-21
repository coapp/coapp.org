---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: The first CoApp Packages are finally here!
tags: ['news' ,'packages ]
---
After what seems like an eternity and a half to get to this point, I am proud to announce that the first CoApp packages are finally here!

I've started by packaging up the CoApp installer itself as a CoApp package, and you can [download that](http://coapp.org/install) , but it's not *really* necessary, as CoApp will install itself when you install any CoApp package. 

The next package that's ready is the first beta of the CoApp developer tools, this release contains the following tools:

*autopackage.exe* -- the CoApp packaging tool ... while it's a bit rough around the edges (like most of the tools) it's what I've been using to build packages so far (*note: it requires a recent build of WiX to be installed* to actually work)

*ptk.exe* -- the CoApp porting toolkit tool -- we use this to do our shallow forks

*dllimport.exe* -- a tool for creating C exports from .NET assemblies ... I should really document this :D

*quicktool.exe* -- a quick little tool for posting source snippets, images and shortening URLs... Again, I should probably document that tool so others could use it.

These tools can be found in the [coapp.devtools package](http://coapp.org/devtools).

And finally, because I'm such a big Node.js fan, a CoApp package for [node.js 0.5.2](http://coapp.org/cdn/node-0.5.2.0-x86.msi)