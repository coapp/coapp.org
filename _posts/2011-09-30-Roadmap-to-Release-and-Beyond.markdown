---
layout: post
author: Garrett Serack <a href="http://twitter.com/#!/fearthecowboy">@fearthecowboy</a>
title: Roadmap-to-Release-and-Beyond
tags: news planning
categories:
- planning
---
As we get closer to getting CoApp Beta 2 out the door, I'm starting to field questions about "what's next?"

I thought this would be a good opportunity to set some expectations as to what features I think we are going to get done in what upcoming milestones.

I'll prefix this with the statement that things are always fluid, and this isn't entirely concrete, and I'm always willing to make adjustments and/or changes to the plan if people have better ideas or other factors come into play.

#### [Imminent] "CoApp 1.0" Beta 2 

- · Fully functional command line package manager 
- · Complete automagic bootstrapper working on blank machines (XPSP3+)
- · Installer GUI (simple, single-screen, one-option)
- · Autopackage to build/sign packages
- · Should work as well in non-english locales (messages not translated)
- · Initial support for Powershell cmdlets (thanks Tim!)
- · No blocking bugs prohbiting core functionality
- · Start cranking out usable packages for things we can actually build (coapp-packages)
- · Package feed generator cmdline tool (mkFeed?)
- · Binary Package Repository 24/7

#### [+8 weeks] "CoApp 1.0" Release Candidate

- · Continual-auto-update of CoApp service working
- · "Software Update" application (knock-off of Windows Update)
- · Autopackage refinements: Automatic dependency resolution.
- · mkSpec/mkProject updated and fully functional
- · Package Manager GUI (the one that lets you search,etc)
- · Package Feedback (aka Disqus Integration)
- · Complete Powershell cmdlets
- · Package Composition refinements
- · Support for Installing Windows Services 
- · Instruction Documents on how to create and publish packages (+screencasts,etc)
- · ZERO new "1.0" functionality beyond this point.

#### [+4 weeks] "CoApp 1.0" Final 

- · Bugfixes from RC only
- · Production quality packages for PHP, Apache HTTPD, NodeJS, (???) and their dependencies

#### [+8 weeks] "CoApp 1.5" Beta

- · It's pretty much all about Azure at this point
- · Support for 'Cloud Registry' service (settings that persist into the cloud)
- · Support for "Web Application" packages (so, things like Drupal, Wordpress etc)
- · Packages should be easily placed in Azure deployment packages and do the right thing.
- · Create "MSI Feeds" -- using an MSI as a container for multiple packages 
- · Create "Zip file feeds" -- using an Zip file as a container for multiple packages 
- · In Azure, service defaults to running packages in unattended mode, and auto update by default
- · In Azure, Update service by default will auto-upgrade packages 
- · Developer CodeSigning - Signing Service in the Cloud (with Outercurve Foundation + maybe Apache Foundation)
- · **Windows 8 AppStore Auto-publish/integration from our repository.** 
- · Windows 8 Server Automation Engine (powershell <<-->> automation engine--Tim?)

#### [+4 weeks] "CoApp 1.5" Release Candidate

- · (TBA)

#### [+4 weeks] "CoApp 1.5" Final

- · Bugfixes from RC only

#### [Over the Rainbow] "CoApp 2.0" 

- · Ideas?
- · the idea about Codesigning and peer-cross-signing for certificates (ie, web of trust)
- · Much More Developer Toolset refinements (tracking upstream project changes, updating/merging, pushing upstream)
- · Visual Studio Integration?
