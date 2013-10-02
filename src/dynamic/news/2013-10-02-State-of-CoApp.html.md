---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: The State of CoApp
tags: ['news' ]
docid: "news:20131002"
---
I know I've been kinda quiet of late; lemme catch y'all up.

## What's up with CoApp tools?

Right around early July, we reached a pretty stable milestone with regards to the CoApp tools; we had noticed that there were some particularly nasty issues when we started to produce packages with too many variants, and each variant had a lot of files, we noticed that the redist package was getting **far** to big. In one case, it was over a gigabyte compressed. 

So, we knew that we needed to split stuff up in a finer grained manner, and so over the course of the summer (when I wasn't distracted on other things), I reworked the tools to generate a separate redist package for each variant. This also required some significant changes to what happens at build time (which it now downloads and overlays the redist package when you need it). This makes it so you never have to download the bits for all the variants that you never use. 

I also added a cmdlet to upload a whole set of packages to a NuGet server, so you don't have to do that all by hand (which would totally suck when you have 70 different variations!)

I'm publishing this as a Beta later this week (update using the `update-coapptools -killpowershells -beta` command) -- **I'll put out another post when I do that.**

### What's the future of the CoApp tools?

Well, we're going to continue to support all the work we've done (as its still the only way to build VC++ NuGet packages that support many variants) and over the course of the year, continue to add a few more features.

As for the future of packaging on Windows in general, I had some ideas that forced me to re-evaluate my ideas and rethink how to get what we all want...

### Where's this all goin'

So, back in August I started looking at what I was going to accomplish over the next year or so, and I thought it would be a good idea to try and see if I could get some of the CoApp package management ideas put into Windows itself (hey, it'd be kinda *nice* to be able to do `apt-get` style-stuff and have that built into the OS)

I had proposed some of this at the beginning of the product cycle for Windows Blue (Server 2012 R2/Windows 8.1) but it was a little too late in the planning cycle, and I gave too-grand of a vision.

I finally came to full understanding of some advice my pappy once told me: **_"The secret to success is to find someone else to care what you care about, and make it their problem."_** ... I looked at him like I understood what he meant, but he could tell that I was just paying lip service. He then said **_"Try it this way: Set the building on fire, take someone else's stuff into the building with you, and then cry for help"_**

The one truth that I do know, is: **Setup ain't sexy**  Nobody is *ever* interested in 'fixing' software installation, because they never believe that it's a problem worth solving.  Those of us who see it as important-or at least, a gateway to achieving other things-are left to chip away at it on the sly.

# This year, I took a different approach. 


### First, find a building I could set on fire.

I sat down and thought **_"What's the smallest, useful thing that I can do that I can get done in time to ship in the next version of Windows?"_**

Instead of trying to get someone to buy into building some new packaging scheme into Windows--which only serves to get everyone who makes something that it would compete with all angry--I decided to flip the idea on it's head. 

What if we had a set of interfaces (APIs, Managability Interface and Cmdlets) that just back-ended to any package management system (or anything that can look like one). Essentially a meta-package-manager that unifies everything together. Make the back end pluggable, so that **any** package management system can be plugged into it, regardless of how it's implemented, it's existing limitations, or how it accomplishes it's tasks.

Then build the interfaces on top of **that**, so that anyone who needs to perform a given task can use a single set of commands (or APIs) to make that happen. 

### Second, track down the people who's stuff I can grab.  

We proceeded to find as many people inside Microsoft who have some tangential relationship to Software Discovery, Installation, and Inventory **(SDII)** and get them to buy into the dream. Everyone who deals with part of this problem generally only does so because they *have* to, so if we can get them to hook into this, they'll get the benefits without having to do all the ground work to pull it all together.

Tracking down everyone we could in the packaging, software installation, and inventory space was a ton of work, but we've talked with just about everyone... I think.

### Third, run into the building.

One group I ran into, was some folks involved in an ISO standardization of 'Software Identity Tags' (aka SWIDTAGS) which is a spec for a way of documenting software so that eventually you could scan a system and find out what is installed, and how it all relates to each other.

This was a great thing! Except, that I needed a much better format than they were coming up with.  

#### Jumping onto an ISO committee

This is how I got my butt onto the ISO 19770-2 working group, in where I brought in the other scenarios that I wanted to support, got them to accept them, and proceeded to do a blitz of rewriting to the schema in time to get it proposed as the next Committee Draft, less than a month after I got involved! 

(As a side note, try not to join an ISO working group 1 month before they submit a CD; making dramatic changes this quickly can make people pretty panicky!)

### Finally, cry for help!

I'm now at the point where we are bringing all of this together to get the approval to put this into the next version of Windows.  Once we've got it that far, I'll have a ton more details (and hopefully some mind-blowing announcements that make *this* post seem like going for ice cream).
 
I really wish I could give you more details at this point, but you'll just have to hang in there until I get past this stage.

-G  