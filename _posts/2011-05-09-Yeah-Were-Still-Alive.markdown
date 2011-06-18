---
layout: post
author: Garrett Serack
title: Yeah, We're Still Alive!
tags: news
categories:
- news
---
  <p>It has been an extreme amount of time since I&rsquo;ve done a status update&mdash;we&rsquo;ve been working hard here, honest!&nbsp; Under a stack of what seems like a million little things, blogging has taken a backseat to development in recent months, but I&rsquo;m hoping to correct that (and have some others do some blog posts too!)</p>

<p align="left">As you can see, we&rsquo;re on a new site; this is powered by <a href="http://orchardproject.net/">Orchard</a>, an open source CMS for Windows.&nbsp; I chose this, primarily because it&rsquo;s built to run on <a href="http://www.microsoft.com/windowsazure/">Azure</a> as well as Windows Server, and the kind folks at Microsoft have given me an Azure account with plenty of resources.&nbsp; I also spun up a <a href="http://screwturn.eu/">Screwturn</a> Wiki for documentation (it&rsquo;s what the Orchard guys use for their site, so I followed suit).&nbsp;</p>

<p align="left">The new site is a tad bare right now, but hopefully we&rsquo;ll get this all put together over the next couple of weeks.</p>

<h2>A new code repository</h2>

<p>As I <a href="http://fearthecowboy.com/2011/04/26/weve-moved-coapp-code-hosting-to-github/">mentioned on my blog last week</a>, we also moved our code repository over to github:</p>

<ul>

<li>&nbsp; 

<ul>

<li><em>While I liked a lot of the things about Launchpad, the website is feeling slower and slower some days, and Bazaar, while offering the features that I like, isn&rsquo;t getting the attention (and developer resources) that git is.&nbsp; Combined with the fantastic innovation happening at Github, it&rsquo;s undeniably the go-to place for open source development these days.<br /></em></li>

<li><em>And, having done some recent tests with git on Windows, it&rsquo;s clear that it&rsquo;s stable and feature rich enough for all my purposes.</em></li>

</ul>

</li>

</ul>

<p><em>&nbsp;</em>&nbsp;</p>

<p>Along with that I also talk about how to checkout the code and compile it up.&nbsp; Yes, it&rsquo;s still an iceberg (most of the code isn&rsquo;t about what you see) but beneath that surface there is a huge amount of functionality lurking.</p>

<h2>Current Status</h2>

<p>The last six months have had a flurry of code development done, including essentially the entire CoApp engine&mdash;originally we were hoping that the volunteer work by the group at the University of Syracuse would produce a functional prototype,&nbsp; it turned out to be too-aggressive of a goal.&nbsp; Consequently, the entire engine was written in three months, and diverted my attention away from other things (this site being one of them)</p>

<h4>Where we at:</h4>

<h3>CoApp Core:</h3>

<ul>

<li><strong>CoApp toolkit </strong>&ndash; all of CoApp&rsquo;s shared code ends up in the toolkit project. A cornucopia of functionality, it provides a tremendous amount of simple, reusable functionality that is shared across all projects.</li>

<li><strong>CoApp Engine </strong>&ndash; we have a managed version of the engine with the basic v1 functionality complete, I&rsquo;d say that it&rsquo;s in a solid beta stage at this point.&nbsp; </li>

<li><strong>&nbsp;</strong></li>

<li><strong>CoApp Command Line Client </strong>&ndash; the command line client works pretty good, if a tad verbose on the command line. It&rsquo;s pretty optimized for the happy-path at this point, but still a pretty good beta.</li>

</ul>



<h3>Publisher Tools:</h3>

<ul>

<li><strong>mkPackage</strong> &ndash; the first tool to create packages for CoApp has been working, but it turned out it took an awful lot of effort to build a package, so we&rsquo;ve depricated that, and gone back to the drawing board. The result, is Autopackage&mdash;a tool designed to do what we really wanted, which is creating packages without messy XML, no need to understand MSI or WiX, or even code signing.&nbsp; </li>

<li><strong>Autopackage</strong>&mdash;is designed to eliminate 100% of the understanding and guesswork in creating packages for consumption.&nbsp; It&rsquo;s already functional and able to produce packages, and is nearing the &lsquo;alpha&rsquo; stage.&nbsp; Eric has done an amazing amount of work in a short time to produce something that is going to get a lot of attention.</li>

<li><br /><strong>simplesigner &ndash; </strong>even simple code signing operations are a hassle in Windows, and when you add .NET strong-naming into the mix, it&rsquo;s all a little difficult to get a hold of, so I wrote the simplesigner tool.. It does exactly what it says, <em>makes digital signing software </em>on Windows <strong>simple</strong>.&nbsp; For .NET executable binaries, it both signs and strong-names the result, and eliminates the guesswork and frustration entirely. </li>

<li></li>

</ul>

<h3>Developer Tools:</h3>

<ul>

<li><strong>Scan</strong>&mdash;Trevor knocked out the first beta of this tool way back in October,&nbsp; It does exactly as I&lsquo;d hoped, a very useful scan of a source tree, and brings back a very large amount of useful data.&nbsp; On top of it&rsquo;s use as part of mkSpec, it&rsquo;s also quite handy on it&rsquo;s own to get an idea of what a project uses, and how it all fits together. Solid 1.0 material.</li>

<li><br /><strong>Trace</strong>&mdash;The ultimate evolution of my original 32 bit trace utility, Rafael and I have put an insane amount of work into this tool.&nbsp; Trace can watch a program, and all of its child processes and record every single file access (and <em>how </em>it was accessed), and record the environment, and command lines for every process.&nbsp; It works for nearly every type of application we&rsquo;ve thrown at it: 32bit, 64bit, .NET, cygwin, native&hellip; The data it gets back is extremely valuable&mdash;we use it primarily to feed into the mkSpec tool to produce project files, but it has a lot of use on it&rsquo;s own.&nbsp; It even captures some data that you can&rsquo;t get from Sysinternals&rsquo; ProcMon. We&rsquo;re pretty much 1.0 gold here. <br /><br /><strong>mkSpec</strong>&mdash;The tool that generates a &lsquo;compiler-independent&rsquo; project file from scan and trace data.&nbsp; It&rsquo;s getting really close to beta stage&mdash;I just need to leverage the latest trace info and we should be on our way.<br /><br /><strong>mkProject</strong> &ndash; the secret sauce of the entire CoApp project.&nbsp; mkProject takes project info from mkSpec and produces Visual Studio project files that are consistent, clean and support easy use of advanced features like PGO optimization, etc.&nbsp; Still a work in progress&mdash;probably a few weeks away from a beta.</li>

<li><strong>testpackagemaker &ndash; </strong>development of the package manager requires a lot of testing examples, and this tool simplifies the generation of native and .NET executables and libraries that support side-by-side so we can build packages for testing. Solid 1.0 stuff here.</li>

<li><br /><strong>pTk </strong>&ndash; a recent addition to the CoApp developer tool lineup, pTk (aka the <strong><em>porting Toolkit</em></strong>)&nbsp; is a build automation tool (no, not like make or msbuild).&nbsp; pTk provides a method for package maintainers to express &lsquo;how-to-build&rsquo; a given project so that the process can be automated by other tools without understanding anything about the build whatsoever (this will let us automate the trace/mkSpec/mkProject process <strong>*a lot*.</strong>)&nbsp; Rather than having the package maintainer/developer express a build process in its terms, it simply is a way of letting the developer write down the commands to build a given project (as a command, or batch script, or whatever) and provides an automatable wrapper for that.&nbsp; This is definitely release candidate material.</li>

</ul>



<h3>Productivity Tools:</h3>

<ul>

<li><strong>quicktool </strong>&ndash; During development, it&rsquo;s always so useful to share code, screenshots etc. when working remotely (either live, via Skype, Lync or IRC) or even via Twitter or email. quicktool provides a system-wide hot-key to uploading images, formatted source snippets, and shortening URLs without having to bring up a separate tool or browser to do so.&nbsp; Faster and more convenient than clumsy websites like pastebin, it allows developers to easily share information at a single keypress.</li>

<li></li>

</ul>



<p>That&rsquo;s about it for today&hellip; over the next few days I&rsquo;ll be posting some tutorials (ie, how to shallow fork a Project for CoApp) and some more information on how you can get involved if you&rsquo;re inclined.</p>


