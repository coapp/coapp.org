---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: The Common Opensource Application Publishing Platform (CoApp)
tags: ['news' ,'planning' ]
docid: "news:20100331"
---

Listen up folks, this stuff is big.

Today, I'm announcing the beginning of a project that intends to bring a little joy into the hearts of Open Source aficionados on the Windows Platform.

The biggest challenge to using/building/maintaining many Open Source applications on Windows, is that Windows does a lot of things differently than Linux and Unix . Different filesystems, command lines, APIs, user experiences ... well, pretty much everything. Regardless of personal opinions about it being the 'right-way' or 'wrong-way', it suffices to say that it is just simply different. 

In order to build an Open Source application like PHP for Windows from scratch, I need to have a collection of libraries created from a fair number of different projects.  This creates a dependency between the code that I'm working on-PHP-and the project that supplies the library that I need.  It's pretty important that I not simply rely upon a previously compiled version of the library (provided either by the project itself, or a third party) for a number of reasons:

* I want to make sure that the library is compiled with the same version of the compiler and libraries as I use.
* In order to fine-tune performance, I'm going to need to change the compiler settings.
* As a security precaution against malicious third parties creating flawed binaries.
* Hey! - It's Open Source. It's pretty much a **moral imperative** that I compile the code for myself. Well, it is for me anyway.

Now, unfortunately, those dependencies don't necessarily share the same development environments, practices, tools, operating systems, or even ideas as to how things should-from one's own perspective-be done (because, as every developer knows, one's own way is the 'one true way').

Interestingly, this problem really doesn't happen on Linux (and other *NIX-like substances).  When someone builds that same application (PHP) on Unix, they do so knowing that the OS works a certain way (generally speaking), and along with the dark magic known as autoconf, you can put the source code on nearly any Unix-variant and just build it.

> Let me take a moment to talk about how this is done in the Linux/Unix world.
> This isn't nearly a problem there because nearly all libraries come with a
> 'configure' script of sorts which the developer runs prior to building the code,
> and the script checks the local development environment,  determines the
> appropriate settings, compilers and dependencies, and creates a build
> script to match.
>
> You download the source, unpack it, run:

``` text
 ./configure, make && make install.
```

> If you are missing any dependencies, you download them, unpack, run:

``` text
 ./configure && make && make install, and go back to the app.
```

> Shared Libraries end up in a common spot (/usr/lib), header files end up in a
> common spot (/usr/include) and binaries can go into a common spot (/usr/bin).
>
> There are some tools and conventions that make this all work pretty darn good,
> and when it doesn't, it's usually not much of a stretch to get it there. 	 

When that same application needs to be built on Windows, it takes some effort. Finding the dependencies (like OpenSSL or zlib), and getting **them** to compile (which is inconsistent from library-to-library on Windows) and then building the application itself-again, inconsistent-generates a binary that you can run. Nearly all of the time, if someone posts those binaries, they bundle up their copies of the shared libraries along with the application.  The trouble is, that there is no common versioning, or really, sharing of shared libraries on Windows. If your app and my app both use the same library, they could (and often do) ship with a different version of it.


## And, there is the user side of the equation...
Of course. Consumers of open source software on Windows have been relegated to manually scouring the Internet for binaries, and they are often out-of-date, compiled against older compilers and libraries, and pretty hard to get working. Clearly there is a strong need for a package management system, along the same lines as apt, rpm, synaptic (and others) but built for the Windows platform, and compatible with Windows features.


## Why not adapt the Unix-way on Windows?

There are two fundamental reasons: Primarily, because it's just not done that way on Windows.  And since Windows doesn't "look" like Unix, it's not very easy to use the same scripts on Windows as Unix. Sure, there are Unix-like environments for Windows (Cygwin, Mingw and Microsoft's own SUA), but they really isolate the developer from Windows itself. While they do try to create a very Unix-like environment, you end up building Unix-style apps on Windows, and pretty much forego the platform benefits that are available.

Secondly, open source software that was originally written for Windows won't be using Linux-style tools anyway. Since I want to unify these two groups, I'm going to want a one-size-fits-all solution.

Really, the solution is to **build it right** for Windows.

## So, what exactly does "Building it Right" mean anyway?

That is, in a nutshell, the sixty-four kilobyte question.

For starters, this means using the tools, methodologies and technologies on Windows, as they were meant to be used, in order to take advantage of everything that Windows has to offer. I'm not interested in simply making a knock-off of the Unix-style way of doing things. Windows doesn't store binaries in c:\usr\bin (/usr/bin) and libraries in c:\usr\lib (/usr/lib), so we're not going to do things like that.

CoApp will:

* Provide a distributed, community driven package management system for open source applications on the Windows Platform
* Handle multiple versions of binaries using WinSxS (I know, even the **mention** of side-by-side components evokes fear, anger and the desire to go off-diet, but bear with me, I think we've got a solution), including multiple copies of the same version of the same library, compiled with different compilers.
* Support 64 bit and 32 bit systems, without hassle or collisions.
* Place binaries, libraries and header files in a logical and consistent location.
* Have tools and methods for handling dependencies.
* Create reliable installer packages (MSIs) for installing open source software.
* Facilitate sharing of components and allow multiple projects to easily both participate and consume them.
* Allow for upgrades and patching of both libraries and applications.
* Be Windows developer friendly. No forcing of building using 'make', but rather taking advantage of the nifty IDEs we already have.
* Also be Windows admin friendly. Even if it's open source, you shouldn't have to be a developer to put Open Source applications on Windows.
* Use advanced optimization techniques like Profile Guided Optimization to produce optimized binaries.
* Support future technologies as they come along.
* Aid in the adoption of Windows Error Reporting (WinQual) to assist in making software run better on Windows.
* End the eternal struggle between Green and Purple. Unless of course you're a Drazi and are conducting elections.

Tall order? You bet. Still, I believe that it's all achievable. I've spent the last several months working on some proof-of-concepts, fleshing out some ideas, and talking with some open source community members. Nothing is currently set in stone, and even the specifications are very fluid at this point.

I've started a project on Launchpad at http://launchpad.net/coapp and the wiki at http://CoApp.org. I'm just starting the specifications and tools to make this happen, and I welcome everyone's input and contributions.