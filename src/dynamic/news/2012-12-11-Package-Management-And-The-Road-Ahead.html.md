---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Package Management and the road ahead.
docid: "news:20121211"
tags: ['news']
---
Howdy!

This post has been a long time coming, the trick is, that a great deal many things have come up and it took some significant effort to work through it all.

First, let me state that CoApp is still alive and we're working to take it to better levels and really get things moving. We just had to take stock of everything, and to make sure that we're on the right track.

After going pretty much non-stop for well over a year on chasing our dreams, I was reminded:

> **"Life moves pretty fast. You don't stop and look around once in a while, you could miss it"**

So, at the end of July, we stopped for a small vacation break during the summer, and we decided to take the opportunity to look how CoApp fits with other things in the package management ecosystem on Windows, and try to make sure that we're doing the right thing, and trying hard to work and play well with others.

I spent a lot of time talking with people one-on-one inside and outside of Microsoft. I spoke with so many people involved in many different places who have some sort of interest in installation or packages, or building software. 

Several thoughts emerged, and it was clear that they needed to be accounted for:

#### Not everyone thinks about packaging the way that I do.
Funny thing. Not everyone sees the world as I do. And worse, when my vision doesn't synch well with theirs, they tend to be less likely to want to do things my way. 

Now, it's not that I didn't understand that, but rather, I think that I was a tad focused on my vision as possibly everything that everyone would need, and one way or another, I'd provide enough value that they'd just *have* to see it my way. 

This of course, also pushed me to trying to do more all at once than I was able to do... More about that later.

#### Along comes Nuget, which changes how developers work with *managed* libraries.
And then a bit over a year ago, Nuget shows up. But... it didn't do anything that I thought was useful to me, and so I really didn't invest any time or effort into it. It's a developer-oriented package manager for managed (or web) libraries. Hardly useful for supporting native code like OpenSSL, zlib, and the like, right?

#### Chocolatey simplifies doing things we were all doing anyway.
A few months later, Chocolatey makes the scene.  Chocolatey uses Nuget to push around scripts that automate the installation of so many things. In CoApp, we called these *faux-packages* -- not really a proper packaging, but an effective method to install things that aren't really easily repackaged.

#### WiX is still the King 
CoApp itself uses [WiX](http://www.wixtoolset.org/) to actually create our packages, so it's not like I didn't realize it's value or underestimate the extensive adoption that it has.  Where I really didn't stop and think was how the 'Monolithic' installer model is really quite important, and how that relates to the work that CoApp is attempting to do.

#### Trying to do too much 
I think the hard part of working on solving a giant problem is that sometimes, it's not all that easy to see the smartest path to accomplishing what you really need to.  I know that I didn't really have good focus on a very small number of scenarios, I was trying to balance far too many things at one time.

## Establishing an ecosystem that works together.
I started thinking about how all of this fits together and how we (as an ecosystem) need to be able to work together--and more importantly--still allow different systems to work how they please.

Many years ago, [Kim Cameron](http://www.identityblog.com/) came up with a list of ["7 Laws of Identity"](http://www.identityblog.com/?p=352/).  They outline some core fundamental principles that any Identity system should follow to ensure that everyone's (users, identity providers, and relying parties) security is maximized.

It occurred to me, that concepts from the Laws could be recycled in a way that reflects how we can define the general parameters for an installation ecosystem:

1. **USER CONTROL AND CONSENT**
    
    Users must always be able to make the ultimate decisions about their system, and installers must never do unauthorized actions without the user's consent. Essentially, we really want to ensure that changes that the user doesn’t want aren't being applied to their systems.  This means that the that installers should always provide a clear and accurate description of the product being installed, and ensure that the user is in control of their systems.  User interfaces or tools that obscure or break this trust with the user should be avoided.  Ideally, user interfaces should strive for some amount of minimalism, not be serving up a collection of pedantic screens which users tediously press 'next' thru.  Less UI means that users are far more likely to pay attention to what's said.
    
    > **Personal Opinion:** I guess at the same time, I should point out a particular gripe of mine, especially with open source software installation on Windows. The proliferation of EULAs and Licenses masquerading as EULAs in the installation process should stop. Many OSS licenses don't actually have any requirement upon the end-user to agree to the terms of them before installation, so please stop asking for people to 'agree' just to make it look like you have a 'professional' installer.  
    > If you *actually* have a requirement to record an acceptance of license, perhaps you should be doing that upon first use (or whatever activity actually requires the acceptance of the license)
    
2. **MINIMAL IMPACT FOR A CONSTRAINED USE** 

    Changes to a system should aim to offer the least amount of disruption to the system. Installing unnecessary or unwanted components adds to bloat, and will increase the potential attack surface for malware. 
   
    > **Personal Opinion:** There is a category of software out there that has opted to provide their software free, but heavily--and often with great vigilance--attempts to install toolbars, add-ins, or other pieces of trash software that serve only to funnel advertising to the user. Others nag the user to change their default search settings, or their browser home page for similar purposes. These behaviors are abusive to customers, and should be avoided at all costs.
    
3. **PLURALISM OF OPERATORS AND TECHNOLOGIES** 

    The ecosystem should easily support many different technologies, there is no one-size-fits-all answer.  Software comes in all shapes and sizes. Any well-behaved individual packaging or installation technology should be welcome to participate.  Choosing one technology over another should be left to the publisher.  Pushing this to the logical ends means that any attempt to unify these should permit and encourage use of any part of the ecosystem.
    
4. **TRANSPARENCY, ACCOUNTABILITY, AND REVERSABILITY** 
    
    Installation technologies should never obfuscate *what* is being done, should never place the system in a state that can't be undone.  Again, keeping in mind that the target system belongs to the user, not the publisher, end users should be able to expect that un-installation should remove without issue or require any additional work to clean up.
    
    > **Personal Opinion:** On a slightly tangential note, I'd like to talk about rebooting the system. Windows Installers seem to be overly-eager to reboot the OS, either on installation or uninstallation. Now look--there is a very small class of software that can actually justify having to reboot the system. 99%+ of software should be able to deal with file conflicts, proper setup, manage their running processes or services, manipulating locked files, remove their temporary files, and all of those other things that you think you need to reboot the system in order to finish the work. If you need help on doing this, ask. You'll be doing everyone a great service.
    
5. **FLEXIBILITY OF INSTALLATION SCOPE** 
    
    *Ideally*, a given package should be able to install into different installation scopes (OS/Global scope, Restricted/User scope, and Local/Sandboxed scope) and support installation into online and offline (VM Images) systems. Packaging systems should consider how they can help products to be fully installed in these scopes.
    
6. **INSTALLATION IS NOT CONFIGURATION**

    Software installation on Windows has since time began, been conflating configuration with installation. This approach introduces several painful problems into the software installation process:
    
    - This increases the amount of UI during installation, which only leads to additional confusion for the end user.
    - Users may not know the answers to configuration questions, and are now blocked until they can find answers.
    - Configuration during installation is nearly always significantly different than the process to configure (or 're-configure') the product *after* installation. Again, confusing to the user.
    - Migrating a working configuration to another system is harder when you have to answer during installation. Configuration should be easily portable between installations.
    - Increases friction for end-users who are trying to automate the installation of software for large numbers of systems. 
    
    Really, don't be that guy.
        
7. **RESPECT THE RESOURCES OF THE TARGET SYSTEM**

    Software publishers need to respect the system to which their software is being installed. You don't own that system, the end user does. Common scenarios that can be disrespectful
    
    **Launching straight from the installer** -- Installation should not be considered good opportunity to launch your application. Similar to configuration issues, this is frustrating to end-users who are looking to automate the installations, and can introduce confusion for users who may not have expected that.  
    **Automatically starting software at system start** -- The proliferation of software that insists on starting up with the OS automatically is getting out of control. Software that wishes to launch at start-up should get explicit *opt-in* consent from the user (after the user has launched the application), not require the user to hunt down the option from a sea of configuration settings to disable it. Oh, and *not* providing a method to trivially disable auto-start is very bad.
    
    **Checking for software updates** -- There are two acceptable methods for automatically checking for software updates. **Preferred**: checking from within the application itself (ie, at startup) and elegantly handling update and restart. **Acceptable**: Launching an update checker **via a scheduled task**, checking and then exiting.  **Wrong**: Auto-starting a background or tray-application to constantly check for updates. 
    
     > **Personal Opinion:** This last one is particularly frustrating.  Since Windows doesn't currently have a built-in 3rd party update service (like Windows Update) that will on a schedule check for updates, download and install them, many companies have resorted to running bloated, wasteful apps in the background, waiting for updates.  This is terribly disrespectful to the end user's system, and offers absolutely nothing of value to the user that a scheduled task wouldn't accomplish with less effort. 
     
8. **CONSISTENT EXPERIENCE ACROSS CONTEXTS** 
    
    Finally, regardless of underlying technology, there should be a common set of commands, tools and processes that allows users to install whatever software in the way that they'd like. Currently, we see that individual installation technologies are all headed in different directions, which makes automating the installation of some pieces of software a nightmare. We as a community need to have the ability to bring all of these pieces of software together without having to manually script each individual combination. 


# The Road Ahead

Whoa, this blog post kinda got away from me. 

Tomorrow, I'll do a post about how I think we can live up to the ideals in these laws, and where we are with CoApp, and how we're gonna get where we want to be.

- Garrett (@fearthecowboy)
