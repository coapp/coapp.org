---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: The 90 second description on how CoApp packages will get built
tags: ['developer', 'coding']
docid: "news:201004131"
---

So, I've been taking questions as to how CoApp packages get built.

Lemme see if I can sketch out the vision for you, so that you get an idea of where it's going. This isn't set in stone, but I've actually validated this is a workable solution.

> And, before we get too far, let me make this exceedingly clear:
> This is ONE METHOD to generate a package that conforms to the CoApp
> package specification. CoApp packages do not have to be built by the tools described here, but merely conform to the spec.
> 
> 
> And, I should mention that yes, tools like CMake may be possible to bring into
> the mix. Doing so, is not the shortest path, but it may provide additional benefits
> in the longer run, so I'm not ruling out it's involvement.

Let's say I want to create a library package for zlib.

First, I'm going to import the zlib source code into a Bazaar in a new CoApp sub-project on Launchpad.

Checking out from there, I'll first see if the project can be compiled at all using MSVC (any version).  If it has an older project file, I'll load it up in Visual Studio 10, and let it upgrade the project, and I'll save it.

Drop back to the command line.

The SCANTOOL file can be pointed to the source directory to scan thru all the source files and build files to generate some intelligence about the project as a whole. It gets a list of all source files (.C, .CPP, .H, etc), potential conditional defines present in the source (```#define FOO ...```) and identifies what additional files are present in the project (for which we'll have to determine what to do with them (delete, include in final as resources, ???). SCANTOOL dumps all of this data into an XML intelligence file for the project.

Build the project (either by the makefile, the vcprojx file, or whatever means necessary). When doing so however,  use the TRACE tool to watch the library get built. TRACE creates an XML file with every file access, write, read, delete and every command line for the build process and all its child processes.

At this point the developer can create a hand-made intelligence file as well for things that are known about the project (what targets are desired, etc).

The intelligence files and the trace data are fed into another tool MKSPEC, which creates a set of .spec files, each of which describes a binary output desired from the project (a .LIB , .DLL, .EXE, etc) and lists the files needed, conditional #defines, and other options. (this is essentially a compiler-neutral way of representing what is needed to build a particular output)

Each .spec file is then fed into MKPROJECT which will generate a VC10 project file. Plugins for MKPROJECT can trivially build other types of project files for things like VC9, make files for MinGW or CMake files for the CMake faithful. MKProject also ties together a collection of project files into a .SLN file for Visual Studio. Outputs are normalized for naming conventions.

The .SLN file is fed into Visual Studio (or MSBuild, the command line tool) and it compiles up the binaries.  (I've got a plan for PGO as well, [profile guided optimization], but I'm going to ignore that right now)

The binaries are fed into a tool called SMARTMANIFEST which creates .manifest and policy files for the library and binds them to any .DLLs and .EXEs created.

The binaries (and manifest data) along with the project source code and build files are fed into MKPACKAGE which uses WiX to build MSI files for each binary, along with a source MSI with just the necessary files to rebuild the binaries (source, vcxproj, sln). 

At that point the developer can identify what files can be trimmed from the source tree, and the whole thing can be updated in Bazaar.

[A flowchart of what I just described](/images/toolchain-diagram.png). Well, without TRACE.

(There's a lot more detail to be sure, but that's the gist of it.)

<span class="label important">Important</span> Hey, rather than commenting here, come join [mailing list][developer:mailinglist], join the team at [IRC][developer:irc] and continue the conversation!