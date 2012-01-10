---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp FAQ - Can you explain how Side-by-side (WinSxS) works?
tags: ['developer', 'coding', 'faq']
docid: "news:20100415faq"
---

(cross-posted to the [mailing list][developer:mailinglist])

Windows [Side-by-side (WinSxS)](http://en.wikipedia.org/wiki/Side-by-side_assembly) technology is a really shiny piece of technology that is not well enough understood, and often misused. This comes from a variety of reasons, one of which is the documentation-while quite excellent-only makes sense if you actually understand everything about WinSxS before hand. When I started brainstormin' how to make CoApp go, I had an inklin' that WinSxS would solve many of the most painful problems, it was just a matter of me figurin' it out. Like my pappy always used to tell me **"It may not be the easy way, but it's the cowboy way."** ... Well, WinSxS may not be the easy way (yet!), but it will most assuredly be the CoApp way.

## Q: What exactly is Windows Side-by-side (WinSxS)?

A:I'll let the good folks from Wikipedia take a stab at that:

Side-by-side technology is a standard for [executable files](http://en.wikipedia.org/wiki/Executable) in [Microsoft Windows XP](http://en.wikipedia.org/wiki/Microsoft_Windows_XP) and later versions that attempts to reduce [DLL hell](http://en.wikipedia.org/wiki/DLL_hell). Side-by-side technology is also known as **WinSxS** or *SxS**. Executables that include an SxS manifest are designated SxS assemblies.

DLL hell designates a group of problems that arise from the use of [dynamic-link libraries](http://en.wikipedia.org/wiki/Dynamic-link_library) in Microsoft Windows. Problems include version conflicts, missing DLLs, duplicate DLLs, and incorrect or missing registration. In SxS, Windows stores multiple versions of a DLL in the WinSXS subdirectory of the Windows directory, and loads them on demand. This reduces dependency problems for applications that include an SxS manifest.

Hmm. I'm not sure that cleared it all up. Simply speakin', WinSxS lets us take a DLL, give it a version number, digitally sign it, and then tell Windows to install it into a little box somewhere, and when we come lookin' for it, it'll give it to us.  Now, when we make a new version of that same DLL, we can tell Windows that when someone comes lookin' for the older one, that they should use this one instead.

Now, before some real WinSxS expert rides up and starts tellin' us that it does a wagonload better than that, I'll capitulate and say sure-it most certainly does a heck of a lot more, but we're gonna take pony steps first. This time around, I'm gonna give ya'll the easy explanation. Damn city slickers...

## Q: So WinSxS stores DLL files?

A: Well, technically speakin', Windows can store more that DLLs with WinSxS-and consequently, rather than just call them DLLs, they call them **Assemblies**. And so WinSxS stores *Assemblies* for us.

## Q: Hang on, that's startin' to sound a lot like that .NET thing...

A: Well, that's because .NET assemblies and *WinSxS* are very similar.  Good eye. Now, stop fussin'.

## Q: How does WinSXS store these Assemblies?

A: There are two implementations of WinSxS, they both work the same for the devleloper, with some minor behind-the-scenes implementation differences that aren't important, and I'll explain the Windows 7/Vista/2008/2008 R2 model.  In the ```C:\Windows``` directory, you'll find a subdirectory called **WinSXS**. Inside there is what appears to be an extraordinarily large number of directories, each holding a few files. And it seems a bit massive, and some of it seems redundant-but it ain't.

WinSxS manages the files in there, so you don't go about muckin' with em.  On top of that, it's not really using up all the space you think it is, 'cause it's using [hard links](http://en.wikipedia.org/wiki/Hard_link) to manage multiple connections to the same files, so leave em alone. You're not gonna 'save space' by messin' with em.

## Q: Are you sure I can't clean that up? It seems like it's takin' like 11 gigs of space.

A: You know, my pappy always used to tell me, **"Never squat with your spurs on"**. Good advice, and here's a bit more, so pay attention. First of all, this ain't 1989-disk space just ain't that expensive. Hell, even if you needed a couple more gigs, you could probably find it somewhere else a lot easier, than muckin' with somethin' you really shouldn't. And all that hard link'n is really hiding the fact that **it's not really using that much space**.

## Q: That WinSxS folder is a mess. How does it find anything?

A: When WinSxS stores stuff in there it stores it by using it's **assemblyIdentity**. The **assemblyIdentity** consists of the name, the **processorArchitecture** (amd64/x86), the **version (##.##.##.##)**, the **publicKeyToken** that was used to sign the assembly, and optionally the language of the assembly (en-us, fr-ca, etc...).

The publicKeyToken is a 16-character hexadecimal string representing the last 8 bytes of the SHA-1 hash of the public key under which the assembly is signed.

## Q: All things being equal, each version is 'unique'?

A: Yeah, pretty much.  Even though everything else can stay constant, every version of an Assembly is uniquely accessible.

## Q: How does a developer set all that information for an assembly?

A: By attaching a particular kind of resource to the Assembly called an [assembly manifest](http://msdn.microsoft.com/en-us/library/aa374219%28v=VS.85%29.aspx). The assembly manifest gives the Assembly its identity.

## Q: How does a developer choose the version of the Assembly they want to bind with?

A: By attaching an [application manifest](http://msdn.microsoft.com/en-us/library/aa374191%28v=VS.85%29.aspx) to the application, the [LoadLibrary](http://msdn.microsoft.com/en-us/library/ms684175%28VS.85%29.aspx) API will ask the WinSxS system to load the correct Assembly at run time.

## Q: How does the publisher of the shared Assembly redirect old bindings to new Assemblies?

A: By specifying the policy in a [publisher configuration](http://msdn.microsoft.com/en-us/library/aa375682%28v=VS.85%29.aspx) file that gets registered along side the Assembly.  The publisher can redirect specific versions, or a range of versions of old assemblies to a new one.

## Q: Can the developer consuming an Assembly say "no, I really want a very specific version" ?

A: Yes. But I'm not going to explain that right now. You're trying to solve the wrong problem, and it's a slippery slope of pain and suffering. If you continue down this path, I'm gonna hog-tie you and throw you in another wagon.

## Q: Didn't you say that we were going to use WinSxS to support multiple compilers, but same version of the same assembly?

A: Yep.  It turns out there is a really easy way for us to support multiple compilers (VC9, VC10, MinGW, etc) with the same Assembly name, version number and architecture by using multiple certificates; one for each different compiler. So, the CoApp project will have several certificates, each publicKeyToken will support a different compiler. If that sounds complicated or troublesome, trust me, it ain't.


## Q: Isn't WinSxS the reason that Visual C++ dependencies are so problematic?

A: Yep.  That's because ... uh, well, let's just say I disagree with how they used them.  Visual C++ would bind to a very specific version number. They would put something like this in the application manifest:

``` text
<assemblyIdentity type='win32'
                  name='Microsoft.VC80.CRT'
                  version='8.0.50727.42'
                  processorArchitecture='x86'
                  publicKeyToken='1fc8b3b9a1e18e3b' />
```

Now, as you can plainly see they use version **8.90.50727.42**. Let's assume you want to run an app, and it needs the C++ redist files, and what if moments before, you had installed the C++ redistributables for the first time, with the version number **8.90.50727.40**? When the application didn't work, you'd think to yourself, but I just installed them (and you' really didn't know what version it was), why is it not working? There isn't an easy way for end-users to track this down, and it makes people go insane.

You're probably thinking that well, you need to get the newest build, right? But you know what? The app probably would have run perfectly with the previous version, and if it was that damn important to have the absolute up-to-the-moment build, they should have given you the updated runtime in the app's installer.

## Q: What should Visual C++ be doing?

A: Well, in my humble opinion, they should have been binding to version 8.90.0.0 and let WinSxS use publisher policies to point to a newer version.  If an application has a known problem with an old redist, they should be shipping the latest one with their app, and let WinSxS take care of it all.

## Q: The Visual Studio team fixed that in VC10 right?

A: *blink*.  Um... sortof.  The VC team stopped using WinSxS for the C++ runtime. I don't really agree with what they've done, but heck, maybe I'm just a back-woods hick who doesn't really understand the problem.  After all, how much can you really know about this stuff without one of those fancy college educations?

## Q: But... you still want to use this for CoApp?

A: You betcha. WinSxS will work, as long as we are playin' by the rules, and we'll make sure there are some tools for divinin' what's wrong if somebody tries somethin' fishy.

## Q: Is this all there is to WinSXS?

A: No, not by a wide margin. But it's enough for you to get a good grip on what it's for, and why it's so damn central to CoApp.

<span class="label important">Important</span> Hey, rather than commenting here, come join [mailing list][developer:mailinglist], join the team at [IRC][developer:irc] and continue the conversation!