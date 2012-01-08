---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp in the first 90 days
tags: ['developer', 'planning']
docid: "news:20100628"
---

(cross-posted to the [mailing list][developer:mailinglist])

It has been nearly three months since launching the [CoApp](http://coapp.org/) project, and in that time I've been absolutely amazed at the response that we've gotten, and the community folks that have jumped on board. As a matter of fact, it's been far busier than I had hoped, and was prepared for.

Initially, I thought that we'd see a few people interested, and maybe two or three volunteer to become committers, and we'd start slowly and build up to actually producing something. Well, within a week or two of the kickoff of the project we saw an explosion of news articles and blog posting that appeared was very cool. 130 people joined the developer mailing list, and we've got 13 committers.

Unexpected rapid growth causes its own problems, first being the lack of something for 13 people to actually start working on, and a definite gap between the vision that I had started with and what everyone understood to be the 'plan'. On top of that, the sheer number of people both internally and externally to Microsoft who wanted to know more and how they could start using it made it a challenge to answer their questions, make the appearances to talk about CoApp, put enough design in place to unblock committers, and oh, wait, actually produce code!

Early on, one of the problems I had is that folks didn't quite know exactly what we would be producing, so I wrote out seven points that describe the scope that the CoApp project is focused on:

1. Provide a specification for package types and how applications are packaged, so that they can behave themselves in a common ecosystem.
2. Provide tools to make packaging easier
3. Shallow-fork a lot of OSS projects to provide clean, well-maintained Windows binaries
4. Provide tools to make shallow-forking & maintaining packages easier
5. A user experience and a service that will allow end-users to manage their installed packages trivially (including updating...etc)
6. A specification for metadata so that any publisher who conforms to the package specification can build and distribute packages using via the client tools (5)
7. Binary and source packages of applications and libraries forked in (3)

With that in mind, we could move forward.

In mid-May Microsoft hosted the CoApp Design and Development summit, where 13 folks from around the world came to Redmond where we spent two days going over my initial vision, adding in everyone's ideas, and finally fleshing out some of the design and the plan forward. As is typical with this type of project, folks are more interested in coding than documenting, but we're slowly filling in the blanks.(Our rough notes on [Day 1](http://coapp.org/not-found.html#page=/Project_Planning/CoApp_Design_and_Development_Summit/Day_1_-_Notes) and [Day 2](http://coapp.org/not-found.html#page=/Project_Planning/CoApp_Design_and_Development_Summit/Day_2_-_Notes). Oooh - [And some pictures](https://skydrive.live.com/?cid=71eaab00a4e2e135&id=71EAAB00A4E2E135!122)!)

> ## A perspective on community-centric design
>
> Working in a large software development company like Microsoft, you find that there are accepted and common practices for just about everything related to designing and implementing software. While individual teams have extremely wide latitude on how they do that, there still tends to be a strong degree of overlap as to **how things are done**. Without going into the tedious details, it suffices to say that the Microsoft model works pretty well for the vast amount of things that it builds. Everything, from conceptual design, reviews, feature design, implementation sprints, testing methodology, testing implementation, localization, bug handling, etc ... are all done with the expectation that you have people who are being paid to perform their tasks-and by virtue of that, care enough about that to get their job done.
> 
> In an Open Source community, things are fundamentally different-individuals are **"working to scratch their own itch"**. They care, simply because they are interested in seeing the project move forward, but it's not near as important to be formal about the methodology as it is to just deliver some code.
> 
> Now, before I move forward, I'll concede that there are as many different models of open source developmen. as there are open source projects. The observations of open source communities that I work in do not necessarily apply to others. That being said, what I'm about to describe is extremely common, and has produced software of a very high caliber.
>  
> Collaboration in open source projects works because people share the same vision and have established a communication and responsibility model where everyone implicitly seems to know what they are responsible for and what they need to do to succeed. This often leads to the natural evolution into a [meritocracy](http://en.wikipedia.org/wiki/Meritocracy) a model where what you contribute is the basis for your seniority and pull with the community. Wikipedia on open source meritocracies:
>> "Technically, the more proficient the developer is in contributing towards the project; developing new features, or maintaining existing code, the more they are required or the more the project necessitates their contribution, and thus the more senior their informal position becomes. Those who contribute more code, and have more of an effect on the direction or status of the project, will tend to have more seniority and influence."
>  
> In the CoApp community, we have multiple methods of communication; ranging from the immediacy of [IRC][developer:irc] and Skype, to [mailing lists][developer:mailinglist]. and throug. to a [wiki](https://github.com/coapp/coapp.org/wiki), we collaborate on what exactly the design is, and once we've reached a consensus, we're able to proceed. This doesn't tend to drive a lot of excessive documentation; the existence of the messages in the [mailing list archive](https://lists.launchpad.net/coapp-developers/), the activity on IRC, and the [wiki](https://github.com/coapp/coapp.org/wiki) content really constitute the design of the system. This also means that while we have a fairly strong idea of how things are being pulled together, individual components don't get detailed design until they are ready to be developed.

To match Point #1 on our list of what CoApp is, we have to crystallize [what exactly a CoApp-style package looks like](http://coapp.org/Blueprints/Package_Blueprint). Initially, I had thought that there would be several package types (apps, shared libraries, source code, static libraries, drivers, etc...) but during the summit we came up with a change to that. A package can contain multiple roles; each role installs a particular type of thing. So, there are several role types (App, shared library, source code, developer library, and drivers) This subtle yet important difference allows collections of things to be versioned as a group and cuts down on the number of packages for a particular purpose. We also studied in depth how complicated things like Perl and Python will need to be assembled in order to provide the flexibility and power they require.

Some of the details (notably device drivers, the concepts of feature advertisement and product composition necessary for things like Python) we're putting off until later to have a bit of experience and understanding how well our design works for the less complex packages. So, other than that I'm fairly sure that we've got a pretty good idea of how those packages are going to look. Certainly it's enough information for me to hand-roll some MSIs that we can use for testing.

I've also spent a bunch of time setting up project infrastructure and the skeleton code and build system for the sub-projects on Launchpad. [It's now possible to actually build CoApp](https://lists.launchpad.net/coapp-developers/msg00472.html), even though nothing actually does anything. This allows some unblocking of the developers who wanted to get cracking.

Currently, we're working on Point #2, which is split into a couple of separate tracks. The CoApp client engine (which is the client component that handles all the magic at install time) is being led by Elizabeth Smith. Elizabeth is a well-known open source (PHP, gtk and others) developer who has wide expertise in C and Windows. The other track is the developer tools where I'm working with a handful of developers to begin fleshing out their design and start cranking out code over the summer.

I would also like to thank all of the committers who came out to the Design & Development Summit in May: Elizabeth Smith, Rafael Rivera, Adam Kennedy, Trent Nelson, Philip Allison, Adam Baxter, Jonathan Ben-Joseph, Ted Bullock, Nasser Dassi, Trevor Dennis, Olaf Vanderspek, Kevin Moore, Mark Stone and Rob Mensching. Your efforts are greatly appreciated, and I'm looking forward to continuing to work together.