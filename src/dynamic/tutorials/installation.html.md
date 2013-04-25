---
layout: 'article'
title: 'Installing the CoApp Developer Tools for PowerShell'
version: 1.0
---

### Requirements

* Windows Vista, Windows 7, or Windows 8
> You need these or later versions of Windows because the tools require Powershell 3.0

* PowerShell 3.0 
> Windows 8 - Installed by default
> Windows 7 or Windows Vista - Install from http://www.microsoft.com/en-us/download/details.aspx?id=34595
	
* NuGet 2.5 or later  
> 2.5 Release : https://nuget.codeplex.com/releases
> Install the Visual Studio Integration component (VSIX)

* CoApp PowerShell Tools
> Stable 'beta' release : http://downloads.coapp.org/files/CoApp.Tools.Powershell.msi
	
* Optional:
> Notepad++ : http://notepad-plus-plus.org/download/v6.3.2.html
> Syntax-highlighting language file : http://downloads.coapp.org/files/autopackage.xml

	
### Installing the package

Installation is simple -- as long as you have PowerShell 3.0 installed, just download and run the CoApp PowerShell tools MSI installer.

<div class="alert-message block-message success">
    <p><b>First Time Installation Issue</b><br/>
	One quick issue: When the installer runs the first time, Windows Installer doesn't always refresh the environment variables like it should.
	
	To make sure that the <code>PSMODULEPATH</code> environment variable is correctly set for new PowerShell console Windows, you either have to: reboot,<br><br>
	
	<b>Or,</b> force Explorer.EXE to reload the environment, (and thereby avoiding a reboot) by opening a PowerShell console and running the following:
	
	<div style="white-space: pre; line-height: 1; background: #FFFFFF; "><span style="font-family: Consolas;font-size: 10pt;color: #008000;"># Forces Explorer.exe to realize the environment has changed.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">
</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">[</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">System</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">Environment</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">]::</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">SetEnvironmentVariable</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">(</span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"PSMODULEPATH"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">[</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">System</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">.</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">Environment</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">]::</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;">GetEnvironmentVariable</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">(</span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"PSMODULEPATH"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"User"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">)</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">,</span><span style="font-family: Consolas;font-size: 10pt;color: #000000;"> </span><span style="font-family: Consolas;font-size: 10pt;color: #808080;">"User"</span><span style="font-family: Consolas;font-size: 10pt;color: #000000; font-weight: bold;color: #000080;">)</span></div>
	<br>Then, close that PowerShell Window, and open a new one. 
	<br>This step is not needed on updates.
	
	<br><br>Once we switch to using the CoApp package manager to ship the tools, this issue will go away.
	</p>
</div>


### Updating the tools to the latest version
Once you have the CoApp PowerShell tools installed, you can update to the latest stable version:

``` powershell
Update-CoAppTools -KillPowershells

```

Or update to the latest beta version:

``` powershell
Update-CoAppTools -KillPowershells -Beta

```

#### Getting Started building C/C++ packages

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

