---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: 1998-The year I built my first Package Management System
tags: ['developer', 'coding']
docid: "news:20100430"
---

In a couple of weeks the CoApp Design & Development Summit that will take place here at Microsoft, I'll have 15 or so people from around the world to thrash thru my some of my crazy ideas regarding package management on Windows.

Scheduling this even has slowed down discussions on the CoApp mailing list-which is ok, rather than trying to settle much before hand, this gives me the opportunity to actually think about a lot of the other scenarios that will need to be handled, and to brainstorm how I think I'd deal with them. Which isn't to say that's how they **will** get dealt with... the difference between my imagination and reality can be pretty wide.

That being said, some of these ideas I have actually started a bit more than 12 or 13 years ago-sometime just before Microsoft started publishing their first information about Microsoft Installer Technology. I was working a contract for SHL, and we were building a system for a client that had 22,000 desktops where they wanted people to be able to run any of the several hundred applications that were available, but without needing to explicitly install them.  My team and I built a system we called **"Zaal"** - a Zero Administration Application Launcher.

Essentially, we made a system for building packages somewhat similar to support what kids today call 'portable applications', but really designed around getting apps from the network ...

The way it worked, the network login script would quickly populate the start menu (this was on Win95 and WinNT 4.0) with icons for all the applications that were available to the entire company (yeah, that was a lot... but this is what the client wanted), but rather than the shortcut pointing to the actual application, we pointed them all to a launcher, along with some parameters that said what they wanted to run. The launcher was a tiny, tight little piece of C code that looked to see if the app was installed, if not it would grab it off the network, and silently install it, and finally it would run it.

Now-ya gotta remember, this was all before this funky-groovy MSI technology. We built a bunch of tools that took a snapshot of the entire 'corporate standard' PC (files & registry), we'd install the application, diff the results, package up what got changed-sometimes with a fair amount of hand tweaking for some apps (not mentioning any names ... LOTUS NOTES [...uh...sorry Ray!]). So, in the end we'd have these packages which could be just-in-time installed with zero UI, and the customer was quite happy.

At the time, I tried to convince the company to turn it into an actual product-but alas, they had little foresight.

But still, looking back, it feels to me like not much has changed. Those packages we created NEVER asked anything at install time. They installed to a predetermined place. They installed with the most logical settings. We even had a secure service which took care of writing registry keys that were normally administrator only, so the app launcher never had to run any higher than "standard user" privileges.

I learned a hell of a lot from the couple years I spent at SHL.  Most of which is, **this stuff is a lot simpler than people like to think it is**.

Over the last decade or so, application installation and deployment has gotten more and more complex-but not because installing applications has become more complex-I think that everyone just got carried away with a lot of stuff that wasn't necessary, or didn't really understand the best way to have done something. And, as the tools became increasingly flexible, the demand for unnecessary features began to creep in, and the cycle begins anew.

I guess that's runaway feature creep.

Don't get me wrong, there are a lot of really cool things that have gone into Windows' Installer Technology over the last decade, and I'm damn thankful for those.  I think that we can leverage what's important while still driving back to simplicity and streamlining everything.