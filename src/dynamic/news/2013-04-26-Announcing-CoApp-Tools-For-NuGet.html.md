---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Announcing CoApp PowerShell tools for NuGet 2.5
docid: "news:201304126"
tags: ['news']
---

Let's start with the *Awesome* -- today, in collaboration with the [Visual C++ team](http://blogs.msdn.com/b/vcblog/archive/2013/04/26/nuget-for-c.aspx) and the [NuGet team](http://blog.nuget.org/) we're pleased to announce the availability of [NuGet 2.5](http://nuget.codeplex.com/releases) and the [CoApp PowerShell tools](http://coapp.org/pages/releases.html) beta.  

This brings the power of NuGet's package management for software developers to C/C++ developers for the first time. 

#### Getting Started building C/C++ packages

Before I ramble on into the sunset, let point out some stuff

We have: 
	- [Tutorials](/pages/tutorials.html) and 
	- [online reference](/pages/reference.html) pages, 
	- and even a [video tutorial](https://www.youtube.com/watch?v=l4MAkR13JPA) you can watch.

#### When you need a bit more help...
	
Tim and I are nearly always hanging out during the day on IRC at [irc://irc.freenode.net/#coapp](irc://irc.freenode.net/#coapp)

When stuff breaks, you can even [file a bug](https://github.com/coapp/coapp.powershell/issues).

And if you're at you're wit's end you can:
	- tweet me [@fearthecowboy](https://twitter.com/fearthecowboy) 
	- or heck, even just email me directly: <a href="mailto:&#103;&#97;&#114;&#114;&#101;&#116;&#116;&#115;@&#109;&#105;&#99;&#114;&#111;&#115;&#111;&#102;&#116;.&#99;&#111;&#109;">&#103;&#97;&#114;&#114;&#101;&#116;&#116;&#115;@&#109;&#105;&#99;&#114;&#111;&#115;&#111;&#102;&#116;.&#99;&#111;&#109;</a> -- (brave, eh?)


	
#### And one more thing...

<div class="alert-message block-message success">
    <p><b>Open Source Hackathon</b><br/>
	
If you're in the Pacific Northwest, or can be on <b>May 10th and 11th</b>, we're holding a free-to-anyone <a style="color:blue; text-decoration:underline;" href="http://coapp.org/news/2013-04-19-Northwest-Hackathon.html">Open-Source Hackathon</a> where the <B>NuGet </b>folks, the <b>CoApp</b> folks and whomever else I can get to show up, will be hanging out, where we'll be working hard to produce packages for NuGet. <br/><br/>We have an open invitation for everyone to come and help us out, or show up and hack away on some other bits of open source software. Food, drinks, fun... what more could you want?
</p>
</div >

### And now, the rest of the story.
<center> ================== </center>

### It's been a long time...

Up till now, NuGet has exclusively supported **.NET** and **Web** developers in packaging reusable libraries and components.  CoApp's original goal was to provide this for native developers, and while we were making great headway on this, I was forced to think about somethin' my pappy always used to tell me: <i><b>"If you find yourself in a hole, the first thing to do is stop diggin'."</b></i>... The trouble is, your not always sure you're in a hole until you get it fairly deep.

So, last fall, I stopped coding for a bit...  I looked long and hard at NuGet and then it hit me--we need to *mesh* with these folks. They've got the integration with Visual Studio, they've got great [package discovery](http://nuget.org/packages) and a [phenomenal number of packages](http://nuget.org/). We don't need a *second* way to do this, we need there to be one great way for developers to get packages and install them regardless if they are Native or Managed developers.

At that point we started gettin' together folks all around and take a long hard look if NuGet could be used for packaging native libraries. Of course, C/C++ libraries are nothing like .NET libraries. While .NET developers have many different .NET frameworks to deal, with the clean way that .NET assemblies work, the problem scope is at least somewhat manageable. In the native world, we have header files, .LIB files, .DLLs ... and on top of that we have so very many different build variations. **Platform** *(x86,x64,Arm,IA64)* , **Toolset** *(VC11,VC10,VC9,VC8,VC7,VC6,GCC... )*, **Configuration** *(Release,Debug)*, **Linkage** *(Dynamic, Static, LTCG, SxS)*, **Application Type** *(Desktop, WinRT, Phone, KernelDriver, UserModeDriver)*, and even **CallingConventions** *(cdecl, stdcall, etc)*.  Worse yet, individual libraries can have their own variants--sometimes pivoting on things you could never predict.

We took a long hard look at the [ExtensionSDK model](http://j.mp/17kDnZS), and tried really hard to intersect that with NuGet, but there were far too many complications and scenarios that we were not sure we'd be able to handle.  Took a couple steps back and try again.

If we kept the things that NuGet had to change down to an absolute minimum, we'd have to make sure that when packages got installed Visual Studio projects could easily integrate things like Include folders, Link libraries, managing outputs and content inclusion, and ... really, anything else the package creator needed to do to let someone use the fruits of their labor.

I knew this meant creating MSBuild project files inside the package. Now, if you've ever taken a long hard look at [MSBuild](http://msdn.microsoft.com/en-us/library/0k6kkbsd.aspx), you'd realize that it's an amazingly powerful build system, but driven by a XML-based format that can be ... *tricky* to play with. Hand-crafting these files is essentially a non-starter, since the complexity of what the package creator has to do grows exponentially as the number of different variations grows. Never mind the fact that simple mistakes are easy to make in XML, and you have to have a fairly intimate knowledge of the format to make sure it's going to work for a wide audience.

<center> ================== </center>

### Gettin' from there to here...

I was pretty sure that I could generate MSBuild project files, but the trick was making it **easy**. 

In January of this year, I started sketching out what information a packager would need to specify. And how could they articulate that information in a way that wasn't burdensome? And just **how** are we going to make it so that we can have a completely flexible means for packagers to say "*these* files are for *this* purpose, but only when *this* set of configurations is true ?

Earlier CoApp tools have used a file format that we called "Property Sheets" -- it's an evolution of an idea that I had years ago of using a format like CSS style sheets.  It's far more readable than XML, and not just simply a data serialization format like JSON -- the structure of the document imparts meaning.  Plus, the parser can be made extremely flexible, which makes it easier for humans to type stuff in, since they don't have to follow excessively pedantic rules for quoting values, or using `,` in a list where `;` could be just as recognizable. I also knew that I needed to be able to map concepts in the Property Sheet to an arbitrary model like MSBuild, without having to modify how the MSBuild data model worked. 

The rewriting I had to do, would take me about two or three weeks I figured, but turned out to be closer to 8 or 9. After that, it's all downhill, right?

<center> ================== </center>
### But our time is finally here...

At that point, I had a rough generator working, and we were rapidly approaching the NuGet 2.5 release date. The NuGet folks have been absolutely awesome in making sure that we're gonna make all this work, and I don't want to drop the ball.  Tim and I have been workin' like crazy to try and deal with all the different scenarios, and even though we're *aware* of pretty much all of them, we were still fighting to actually vet and validate them.  And it seems that each one has it's own quirks, and requires yet another special condition or specific generation feature.

Yet, we've prevailed. We've [published the tools](/pages/releases.html), and while there are still many things to add, fix and enhance, I think we're finally on solid ground.

