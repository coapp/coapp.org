---
layout: post
author: Eric Schultz
twitter: wwahammy
title: Preview of CoApp GUI - Part 1
tags: ['gui', 'updater']
docid: "news:20120217"
---

Over the past few weeks, I've begun working full-time on creating a lo-fi mockup of the CoApp GUI as the beginning of my work on the GUI. At this point, I feel it's appropriate to share what's been accomplished, where we intend the GUI to going and how long I anticipate that taking. 

The mock up was made in Sketchflow in Expression Blend. Sketchflow provides us with a good enough idea of how the interface might work but it has low enough fidelity that we don't get mired in minute design details. This is not the final product but it gets us in that direction.

The GUI consists of two major parts: an update client and the general package manager. This post will focus on the update client, while a future post will discuss the package manager.

#Update Client

The update client is used to automate updates and upgrades of CoApp installed software. The update client follows a schedule and runs regularly in order to update CoApp software when needed in much the same way as Windows Update. Indeed, its user interface is very similar to Windows Update. The primary purpose of this is to put users at ease when they use the CoApp Updater.

@[The home screen of the CoApp Updater](/images/blog/guipreview/coappupdatingchecking.png)

A user can get into CoApp Updater in a couple of ways. First they could manually start CoApp Updater if they were interested in checking if any updates existed for their software. Second when CoApp Update automatically runs in the background as scheduled it places a small icon in the system notification area. The user may double click that icon to open the CoApp Updater.

When user manually starts the CoApp Updater, the above screen is where they start. Once that's completed they go to the either a screen saying no packages are available or that packages are available.

@[Your system is up to date](/images/blog/guipreview/noupdates.png)

The above screen shows when no package are available. The user can recheck for updates if they'd like. If there are updates, the user sees the following screen:

@[There are packages available](/images/blog/guipreview/updatesavailable.png)

In this case, the user can either click on the link titled "5 updates available" to view the updates and upgrades or can press Install to install all the selected updates.

@[Select packages](/images/blog/guipreview/selectupdates.png)

When the user views the updates they see the screen above. Again this is very similar to Windows Update. There are a few features that are not shown. One feature is that the user could block a particular update by right clicking on the name of the update. Additionally based upon community feedback during our conference call, I will be adding a method for the user to see which packages depend on a particular package to be updated. A user may want to know whether an updatable package, say OpenSSL, is used by another particularly vital package, say PHP. The user for whatever reason may want to verify that no packages used by PHP are ever updated. This allows the user to perform this verification.

When the user clicks install, the following screen is shown:

@[Installing](/images/blog/guipreview/installingupdates.png)

Again, this is very similar to the Windows Update installation screen.

#That's neat, but when do I get this?

The update client is on a very aggressive schedule with the plan of having it committed into the main CoApp repository in about three weeks and to be officially released in the CoApp 1 RC.

Because of this timeline, if you want your suggestions added into the Updater for this initial release, time is of the essence! Please provide feedback as soon as possible on this post, the CoApp [mailing list](https://launchpad.net/~coapp-developers) and/or the [CoApp IRC channel](http://coapp.org/developers/irc.html)