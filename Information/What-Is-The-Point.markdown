---
#
# use this template for sub-pages in the information tab 
# make sure that you put the same title in the _layouts/information.layout file 
#
layout: information
subtitle: What's the point of CoApp
---
<p>

<div>

<h2><span >What is the point of CoApp?</span></h2>

<p>The biggest challenge to using/building/maintaining many Open Source applications on Windows, 
is that Windows does a lot of things differently than Linux and Unix . Different filesystems, 
command lines, APIs, user experiences &hellip; well, pretty much everything. Regardless of personal 
opinions about it being the &lsquo;right-way&rsquo; or &lsquo;wrong-way&rsquo;, it suffices to say 
that it is just simply different.</p>

<div class="text">

<div id="page-top">

<div id="topic">

<div id="pageText">

<p>In order to build an Open Source application like PHP for Windows from scratch, I need to have a 
collection of libraries created from a fair number of different projects. This creates 
a<em>dependency</em>between the code that I&rsquo;m working on&mdash;PHP&mdash;and the project that 
supplies the library that I need. It&rsquo;s pretty important that I not simply rely upon a previously 
compiled version of the library (provided either by the project itself, or a third party) for a number 
of reasons:</p>

<ul>

<li>I want to make sure that the library is compiled with the same version of the compiler and 
libraries as I use.</li>

<li>In order to fine-tune performance, I&rsquo;m going to need to change the compiler settings.</li>

<li>As a security precaution against malicious third parties creating flawed binaries.</li>

<li>Hey!--It&rsquo;s Open source. It&rsquo;s pretty much a <strong><em>moral imperative&nbsp;
</em></strong>that I compile the code for myself. Well, it is for me anyway.</li>

</ul>

<p>Now, unfortunately, those dependencies don&rsquo;t necessarily share the same development 
environments, practices, tools, operating systems, or even ideas as to how things should&mdash;
from one&rsquo;s own perspective&mdash;be done (because, as every developer knows, one&rsquo;s 
own way is the &lsquo;one true way&rsquo;).</p>

<p>Interestingly, this problem really doesn&rsquo;t happen on Linux (and other *NIX-like substances). 
When someone builds that same application (PHP) on Unix, they do so knowing that the OS works a certain 
way (generally speaking), and along with the dark magic known as autoconf, you can put the source code 
on nearly any Unix-variant and just build it.</p>

</div>

</div>

</div>

</div>

<p>&nbsp;</p>

</div>

</p>

<table style="border-width: 0px; width: 100%;" border="0" cellspacing="0" cellpadding="0">

<tbody>

<tr>

<td style="border-width: 0px;" valign="top" width="60"></td>

<td style="border-width: 0px; color: black; background-color: #d0d0d0;" valign="top">Let me take a moment to talk about how this is done in the Linux/Unix world. This isn&rsquo;t nearly a problem there because nearly all libraries come with a &lsquo;configure&rsquo; script of sorts which the developer runs prior to building the code, and the script checks the local development environment, determines the appropriate settings, compilers and dependencies, and creates a build script to match. You download the source, unpack it, run ./configure, make &amp;&amp; make install. If you are missing any dependencies, you download them, unpack, run ./configure &amp;&amp; make &amp;&amp; make install, and go back to the app.&nbsp;<br /><br />Shared Libraries end up in a common spot (/usr/lib), header files end up in a common spot (/usr/include) and binaries can go into a common spot (/usr/bin).&nbsp;<br /><br />There are some tools and conventions that make this all work pretty darn good, and when it doesn't, it's usually not much of a stretch to get it there.</td>

<td style="border-width: 0px;" valign="top" width="60"></td>

</tr>

</tbody>

</table>

<p>

<div >

<p>&nbsp;</p>

<div class="text">

<div id="page-top">

<div id="topic">

<div id="pageText">

<p>When that same application needs to be built on Windows, it takes some effort. Finding the 
dependencies (like OpenSSL or zlib), and getting<strong>them&nbsp;</strong>to compile (which is 
inconsistent from library-to-library on Windows) and then building the application itself&mdash;
again, inconsistent&mdash;generates a binary that you can run. Nearly all of the time, if someone 
posts those binaries, they bundle up their copies of the shared libraries along with the application. 
The trouble is, that there is no common versioning, or really, sharing of shared libraries on Windows. 
If your app and my app both use the same library, they could (and often do) ship with a different 
version of it.</p>

<h2 ><strong><em>And, there is the user side of the equation&hellip;</em></strong></h2>

<p><strong><em>&nbsp;</em></strong>Of course. Consumers of open source software on Windows have been 
relegated to manually scouring the Internet for binaries, and they are often out-of-date, compiled 
against older compilers and libraries, and pretty hard to get working. Clearly there is a strong need 
for a package management system, along the same lines as<em>apt,&nbsp;</em><em>rpm, synaptic 
(and others)&nbsp;</em>but built for the Windows platform, and compatible with Windows features.</p>

<h2 ><strong><em><br />Why not adapt the Unix-way on Windows?</em></strong></h2>

<p><strong><em>&nbsp;</em></strong>There are two fundamental reasons: Primarily, because it&rsquo;s 
just not done that way on Windows. And since Windows doesn&rsquo;t &ldquo;look&rdquo; like Unix, 
it&rsquo;s not very easy to use the same scripts on Windows as Unix. Sure, there are Unix-like 
environments for Windows (Cygwin, Mingw and Microsoft&rsquo;s own SUA), but they really isolate the 
developer from Windows itself. While they do try to create a very Unix-like environment, you end up 
building Unix-style apps on Windows, and pretty much forego the platform benefits that are available.</p>

<p>Secondly, open source software that was originally written for Windows won&rsquo;t be using 
Linux-style tools anyway. Since I want to unify these two groups, I&rsquo;m going to want a 
one-size-fits-all solution.</p>

<p>Really, the solution is to<strong>build it right</strong>&mdash;for Windows.</p>

<h2 ><strong><br />So, what exactly does &ldquo;<em>Building it Right&rdquo;&nbsp;</em>mean anyway?</strong></h2>

<p>That is, in a nutshell, the sixty-four kilobyte question.</p>

<p>For starters, this means using the tools, methodologies and technologies on Windows, as they were 
meant to be used, in order to take advantage of everything that Windows has to offer. I&rsquo;m not 
interested in simply making a knock-off of the Unix-style way of doing things. Windows doesn&rsquo;t 
store binaries in c:\usr\bin (/usr/bin) and libraries in c:\usr\lib (/usr/lib), so we&rsquo;re not 
going to do things like that.</p>

<p>CoApp will:</p>

<ul>

<li><br>-Provide a distributed, community driven package management system for open source applications 
on the Windows Platform</li>

<li><br>-Handle multiple versions of binaries using WinSxS (I know, even 
the <em><strong>mention&nbsp;</strong></em>of side-by-side components evokes fear, anger and the 
desire to go off-diet, but bear with me, I think we&rsquo;ve got a solution), including multiple 
copies of the same version of the same library, compiled with different compilers.</li>

<li><br>- Support 64 bit and 32 bit systems, without hassle or collisions.</li>

<li><br>-Place binaries, libraries and header files in a logical and consistent location.</li>

<li><br>-Have tools and methods for handling dependencies.</li>

<li><br>-Create reliable installer packages (MSIs) for installing open source software.</li>

<li><br>-Facilitate sharing of components and allow multiple projects to easily both participate and 
consume them.</li>

<li><br>-Allow for upgrades and patching of both libraries and applications.</li>

<li><br>-Be Windows developer friendly. No forcing of building using &lsquo;make&rsquo;, but rather taking advantage of the nifty IDEs we already have.</li>

<li><br>-Also be Windows<em>admin</em>friendly. Even if it&rsquo;s open source, you shouldn&rsquo;t 
have to be a developer to put Open Source applications on Windows.</li>

<li><br>-Use advanced optimization techniques like Profile Guided Optimization to produce optimized 
binaries.</li>

<li><br>-Support future technologies as they come along.</li>

<li><br>-Aid in the adoption of Windows Error Reporting (WinQual) to assist in making software run 
better on Windows.</li>

</ul>

</div>

</div>

</div>

</div>

</div>

</p>
