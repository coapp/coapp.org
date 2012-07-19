---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Released, at last
docid: "news:20120719"
tags: ['news']
---
**A little over two years ago, I launched this project.**

I started with an idea. No code, no full plan, just this idea that I wanted to fix a fundemental gap in the way that open source software finds its way onto Windows.  

I sought out the Outercurve Foundation--still sporting that new Foundation smell--as our home. At the time, it was the one place that we could incubate this idea without undue burden on my corporate overlords, and still retain the complete and total freedom to take this project where we wanted to.  Even now, CoApp is the *still* the only Outercurve project to not start with a code-contribution and a rights assignment. 

From there, I brought together 15 people from open source commiunities and shared my initial vision.  We spent three days refining that into what eventually became this shared vision of what was needed to close this gap.  A lot changed from that first day, and over the course of of the last couple years, it would change even more.  

**Biting off more that we could chew**

My pappy once told me "It's only after you've been thrown from the horse, that it's easy to see why". Which was his way of saying that sometimes it's impossible to see what's not going to work until you've done it wrong.

Something that I didn't realize until quite recently, is that "starting-from-scratch" was even harder than it sounds. For the first year, I was the only full-time project member, which made it really difficult for others to contribute at the same pace as I could. Even though the barrier for others to just jump in and help was pretty high, there still was a few folks who were able to pitch in here and there. 

There was also the ever-exspanding list of things that needed doing to make the project successful.  We needed a website, a wiki, tools to build packages, tools to help build projects, shallow forks of projects, digital signing tools, bootstraper technology to get the engine onto the user's machine, a service to accept packages and produce feeds, a content-distribution-network... all this, on top of the massive undertaking of a new package manager itself.

**And a year passes...**

Last summer, we reached what I called "Beta" -- it was the point where we had a complete, end-to-end functional system, though buggy as heck, but had what I considered to be the core functional bits...Except there were a couple critical failings in the way that it worked with Windows Installer, and we needed to make a fundemental change in the infrastructure--changing the core engine from working as a library to a Win32 service.

That lead to "Beta 2" last fall, and "Beta 3" in late winter--each step making the core scenarios each one step closer to reality. With each new build we were still discovering things about the packaging and installation processes that encouraged us to continually refactor parts of the system.

When we released our "Release Candidate" a couple months ago, we had reached a pretty stable state. The 'happy-path' was quite functional, packages could be created, installed, removed, and our repository of shallow-forked projects was growing constantly. 

**We made it!**
Finally, after a half million lines of code (spread out across all of our tools and libraries) and a few thousand builds, we've reached our 'Release' milestone. 

We've got a stable, moderately robust toolset to build, consume and update packages in a frictionless way.   

I won't jump out and say that it's bug-free yet, but the primary scenarios all seem to work pretty good, and we'll be constantly fixing bugs and updating it as we go forward.

And we're not even done yet.

**Where do we go from here?**

Over the course of the next few weeks, we'll be constantly publishing new content here, starting with some much-needed 'how-to' and tutorials, as well as additional documentation and instructions on how to actually build packages, troubleshooting, and even building CoApp itself and pushing changes (so that anyone can fix bugs and push back changes)

As well, we'll be working on our new feature roadmap and figuring out how to implement all that too!


