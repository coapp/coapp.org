---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp FAQ - A few important distinctions.
tags: ['developer', 'coding', 'faq']
docid: "news:20100729faq"
---

(cross-posted to the [mailing list][developer:mailinglist])

It's been suggested a few times over the last several weeks that CoApp won't provide any value for the .NET community. With the emergence of several alternative projects to provide a form of package management (NPack, OpenWrap, nu-net, and others), I figured I'd better make some time to explain how CoApp and .NET get along.

## Q: Isn't CoApp about packaging applications?

A: Well, oddly enough, the original vision for CoApp was less concerned about actually installing **applications**, but rather installing **shared components**.  The ability to install an application comes by virtue that applications tend to be collections of components (shared or private), and a decent package management system should cover these goals easily.

## Q: If CoApp is such a great idea for .NET why is all the work focused on native applications?

A: The reasons that our initial work that we're doing is focused around native shared libraries and applications, is that they require quite a bit more adaptation to correctly work using modern C compilers and Side-by-Side technology. Once we've got the tools to build properly behaving projects to produce binaries that are useful in this fashion, we'll be in a good place to actually produce packages themselves.

.NET Assemblies, by their very nature are already beautifully designed to be adapted into CoApp packages.  Strong-named assemblies install into the GAC-which is really just the .NET implementation of the Windows Side-by-Side technology-by design. CoApp .NET packages simply install the assemblies into the GAC, where all applications can share them in the way that was intended.

## Q: What if I don't want stuff to be in the GAC?

A: I'd ask you to reconsider.  I can appreciate the desire to maintain control over every aspect of building and distributing your application.  On the other hand libraries that designed to be shared shouldn't require the consumer of the library to do anything, except for consume them.  The publisher of the shared library shoulders the responsibility of maintaining the library and publishing security updates as well new versions.  As with native Side-by-Side assemblies, the publisher can indicate what version of a library should be used when a particular version is requested.

## Q: What possible reason should I choose using CoApp over another .NET package management?

A: Well, like I've said, a plethora of implementations is always a good thing. From what I can see, most of the other package management systems are focused on assisting developers in getting simplified access to shared .NET components.  CoApp takes a larger scope, hoping to serve developers, end-users, and IT administrators alike.  Our design includes the ability to update any components without the necessity of shutting down or rebooting processes (or even god-forbid, the system itself).  CoApp is designed to apply to software regardless of the language it's written in, from native (C,C++,etc) to managed code (.NET; C#, VB.NET, etc) ,to dynamic languages (Perl, Python, etc) and web apps (ASP.NET, PHP, and more).

## Q: Why have you chosen MSI files rather than something simpler and more convenient (like Zip+Manifest)?

A: Oh, trust me, I really wanted to.  I realize that Windows Installer is kindof a bloated beast that has a lot of downsides; we've has chosen MSI as the packaging format because it is handles so many other situations very well-one noteable point, is that on XP & Windows 2003, the only way to install a native Side-by-Side components is by using MSIs. We've taken steps to lessen the burden by deliberately limiting the scope of what we are using in MSI to not encumber packages in a painful mess.

As well, by using MSIs we gain the ability to leverage things like group policies, Windows Logo certification, transactional installations, and trivial adoption by other non-CoApp consumers-there is nothing that would stop someone from using CoApp packages for some of their dependencies, and without having do anything other than install the MSIs.