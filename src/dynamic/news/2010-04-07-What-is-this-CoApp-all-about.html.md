---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: What is this 'CoApp' all about?
tags: ['news' ,'planning' ]
docid: "news:20100407"
---

Last week, I [posted][news:2010-03-31] about a new open source project that I've launched called "CoApp" (The Common Opensource Application Publishing Platform). As I've mentioned on the project site, "CoApp aims to create a vibrant Open Source ecosystem on Windows by providing the technologies needed to build a complete community-driven Package Management System, along with tools to enable developers to take advantage of features of the Windows platform."

Ugh - a mouthful-and all chocked full of them shiny marketing words.(Uh.. yeah, I know wrote that.).

## So, what does that mean?

Well, while Windows provides some pretty good stuff for packaging applications in the form of Windows Installer* technology (aka "MSI" [[1]](#MSI), the down side is that the open source community hasn't really picked it up in the same way that they have picked up packaging on other platforms where they create repositories and distributions of software, and so we're missing out on having these nice, consistent collections of all these great open source apps.  That's where I really want to be.

'Course, my pappy always used to tell me *"it don't take a genius to spot a goat in flock of sheep"* ... Sure, it's easy to see what the problem is, question is, how do we go about fixin' it?

Last fall, I started to sketch out what that should look like, and what it would take to get there.  After a few months of poking the right people, I started to get agreement here at Microsoft that this really is a great idea, and we should be spending time on it. (And, 'course, by 'we' I mean 'me')  I know from personal experience with building open source software on Windows, that things are not only sometimes tricky, but often downright impossible to build correctly, and even harder to make sure the software is built in such a way that anyone on Windows could use it.  I've come up with a plan for building a set of tools to help open source software build better on Windows, along with automating the packaging in such a way that will allow us to build yet more shiny tools to locate and install them.

Along with the tools, we're going to need to lay down some guidance on how to use them to build packages that play nice with each other-I want to make sure that I'm never running into "DLL Hell", never having to search for missin' bits, and always getting the right package for the right job.  At the same time, I really want to use some optimization techniques to help open source software run better on Windows.

Starting with [ApacheCon](http://port25.technet.com/archive/2009/11/03/microsoft-and-apachecon-2009.aspx) last fall, I began to reach out to people I know in open source communities, not only to get their buy-in that this is a good idea, but solicit their help. I've already secured a handful of folks who are interested in helping, and I can always use a few more.

Over the course of the next month or so, we'll be the filling in the details on what all of this looks like on the [project site](http://coapp.org/), and discussing the merits on the [mailing list][developer:mailinglist]. From there, we'll begin to build the tools, and with a bit of luck, we'll start producing packages a few more months after that. We'll probably start with the packages that make the most sense (Apache, PHP and Python) and work our way out from there.

## And just how does Microsoft fit into all of this?

Well, the folks here at Microsoft have recognized the value in this project-and have kindly offered to let me work on it full-time.  I'm running the project; Microsoft is supporting my efforts in this 100%. The design is entirely the work of myself and the CoApp community, I don't have to vet it with anyone inside the company. This really makes my job a dream job-I get to work on a project that I'm passionate about, make it open source, and let it take me where it makes sense.

Sure, it's a large project, but I'm pretty sure that we're headed in the right direction-if you'd like to come out and help (or even just come get more details about what I'm talking about), you can start at http://coapp.org.

[[1]](!MSI) I know, some people don't particularly like MSI, but trust me, it's all in how it's used - ya don't blame the horse for throwin' a shoe.