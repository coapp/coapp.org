---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: Notes about shared libraries in CoApp
tags: ['developer', 'coding']
docid: "news:201004132"
---

(cross-posted to the [mailing list][developer:mailinglist])

Since I've been jumping all around the map on answering questions, I wanted to first jump into the heart of what CoApp really fixes, and we'll work our way out from there.

Libraries (static or dynamic) are the heart and soul of pretty much all software-and open source is no exception. If code didn't depend on no other code, then packages would be insanely trivial to engineer, we'd just zip up the files and that would be it.

However, since this isn't the case, we need to understand what Libraries mean to us, and what we need to ensure to make everything end up shiny.

What CoApp will address:

* There must be a common method to access a Shared Library, in a logical consistent fashion particular version of a library (with a specific binary ABI) must be upgradable to a new compatible version without having to adjust a currently installed application.

* Multiple versions of a library (with potentially different binary ABIs) must be able to be present at the same time.

* Multiple compilers must be supported--that is, multiple copies of the same library, the same version and the same ABI, but reliance on a different compiler (and CRT runtime).

* Libraries must be installed and upgraded independently of an application.

* An application must be able to override a system default version of a library if necessary.

* Shared libraries should always be packaged with their relevant import libraries (.lib) and header files (.h) files.

* Luckily, Windows provides us a way to do most of that without much difficulty-provided you have tools to automate that.

WinSXS (Windows Side-by-side) technology allows us to install multiple versions of libraries, each tagged with a version (Major.Minor.Revision.Build) , and allows us to build 'policy' files that direct programs to use the correct version.  We use manifests with the applications to tell it what version (Major.Minor) it requires, and the policy files direct the EXE to the best match (most of the time, the most recent version in a given Major.Minor set.

Consistency of the Major.Minor versions indicates a binary ABI compatibility. Changing the Major or Minor numbers in effect declares that binary compatibility may not be guaranteed (however, policies can be written to forward older versions if the author claims binary compatibility is still present)

In order to use WinSXS however, all binaries must be signed with an Authenticode code-signing certificate, from a reputable CA (certifying authority).

This signing requirement actually turns out to be the key to supporting multiple compilers at the same time-a publisher can use multiple certificates, reserving an individual certificate's use to a particular compiler. (so CoApp as a publisher will have certificates for signing packages for both  VC9 and VC10 binaries)

In order for the consuming application to specify what library it is looking for, its manifest lists the certificate thumbprint, the name of the library and the version.

<span class="label important">Important</span> Hey, rather than commenting here, come join [mailing list][developer:mailinglist], join the team at [IRC][developer:irc] and continue the conversation!