---
layout: post
author: Garrett Serack <a href="http://twitter.com/#!/fearthecowboy">@fearthecowboy</a>
title: Changes to the design of CoApp
tags: news development design
categories:
- news
---
On Friday, we had a conference call to discuss a critical problem in the CoApp package manager.

>> ... when the user double-clicks on an a CoApp MSI, Windows Installer 
>> elevates the installer process by switching to the LOCALSYSTEM (NT AUTHORITY\SYSTEM) 
>> account, but actively removes a bunch of privileges that they didn’t figure an 
>> installer would need—specifically the ability to create symlinks has been 
>> removed. Symlinks are a critical part of CoApp’s design, and I’m not willing
>> to compromise the features thatrely on them...

Having looked at a [few ways to overcome this limitation](https://github.com/coapp/coapp.org/wiki/Coapp-engine---engine-as-a-service-redesign), we've pretty much settled on the idea
that we will split up some of the CoApp components into finer-grained peices, and create a service that can perform
the requisite high-privilige operations that are needed to for CoApp to manage packages correctly.

This involves taking the CoApp Toolkit library, and splitting into two peices--the components that we need for the higher-priviliged service
(becoming the Toolkit Core) and components that have more general purpose (the Toolkit Client). The same goes for the the Engine library itself,
being split into the Engine Core, and the Engine Client. It's likely that most of the functionality will still reside in the
Engine core, and the Engine Client is there to facilitate the use of the Core.

A lightweight Win32 Service EXE is created to host the Engine Core itself.

<p class="ScrollImage"><img src="/images/blog/service.png" title="service components" alt="service components" /></p>

The communication between the client and service peices of CoApp will use a simple bidirectional interface over named pipes, which will 
make it pretty trivial to automate the CoApp engine from pretty much any language on Windows.

In some ways, this is actually a mixed blessing. Migrating part of CoApp itself into a Win32 service was a longer-range goal I've had, as it provides a few things:

>>  -- Lets us create symlinks from an MSI install.<br>
>>  -- Limits even further the actual amount of code running at an elevated level.<br>
>>  -- Ensures all the network communication into userspace where it can happen at a lower privilege and take advantage of the user's network settings<br>
>>  -- we can decide what features "require" the user to be elevated (so, updates can be configured to install without direct user elevation)<br>
>> 

This does of course come at an increased price; we not only need to do the appropriate refactoring necessary in CoApp engine and toolkit,
but now that we're adopting the Win32 Service model, we're going to also run a few components thru a very-fine-grained Security Audit.

A few links regarding Microsoft's Security Development Lifecycle:<br>
[SDL Website](http://www.microsoft.com/security/sdl/default.aspx)<br>
[SDL With Agile Development](http://www.microsoft.com/security/sdl/discover/sdlagile.aspx)<br>
[Microsoft Security Development Lifecycle Guide v5.1](http://www.microsoft.com/downloads/info.aspx?na=41&srcfamilyid=e5ff2f9d-7e72-485a-9ec0-5d6d076a8807&srcdisplaylang=en&u=http%3a%2f%2fdownload.microsoft.com%2fdownload%2f2%2f1%2f4%2f21496F7B-3977-4F20-8621-F24F43212406%2fMicrosoft%20SDL_Version%205.1.docx)<br>
    
- garrett