---
layout: 'article'
title: 'Setting up Git and GitHub for development on Windows' 
version: '1.0'
docid: "developer:git-setup"
---

### Requirements:

You need the following downloads in order to work with Git and GitHub on Windows:
- The [git command line](http://msysgit.googlecode.com/files/Git-1.7.8-preview20111206.exe) client.
- [Putty](http://the.earth.li/~sgtatham/putty/latest/x86/putty-0.62-installer.exe) -- a ssh/telnet client for Windows (since GitHub uses ssh for Git communications).

<hr>
### Installing git

The msysgit client is a monolithic install of the command line Git, a Git GUI and a bunch of git-related tools.

Installing Git is fairly straightforward--run the installer--there are two options you should change:

Make sure you add Git to the path (option #2 or #3, your preference):
@[Choose the second or third option](git-1.png)

Select "Checkout-as-is, commit-as-is"
@[Choose the second or third option](git-2.png)

Video Walkthrough:
%[720,405,git-video.jpg,http://coapp.org/videos/git.mp4,http://coapp.org/videos/git.webm]

<hr>


### Installing putty 

Putty is an SSH client for Windows. Git can use this to communicate securely with Github.

Installing is fairly easy, just a couple of steps after installation that we'll need to manually handle. After installing the app, you'll want to modify the PATH and set the GIT_SSH environment variable so that Git will know to use it.

To ensure that putty is in the path, you'll need to run the following commands from an elevated command prompt:

<div class="alert-message warning">
<p>Run these commands in an Elevated (Administrator) command Window</p>  
``` bash

powershell 

[System.Environment]::SetEnvironmentVariable("PATH", $Env:Path + ";" + "c:\program files (x86)\PuTTY", "Machine")

[System.Environment]::SetEnvironmentVariable("GIT_SSH","plink", "Machine")

```
</div>

Video Walkthrough:
%[720,405,/images/tutorials/putty-video.jpg,http://coapp.org/videos/putty.mp4,http://coapp.org/videos/putty.webm]


<hr>
### Setup account with GitHub
You'll need an account with GitHub if you want to be able to commit changes to CoApp.

You can create a free GitHub account at https://github.com/signup/free 

After you've created an account, you'll need to setup a public/private keypair so that Git can talk to GitHub:

<hr>
### Generating a public/private key pair for GitHub

Video Walkthrough:
%[720,405,/images/tutorials/keypair-video.jpg,http://coapp.org/videos/keypair.mp4,http://coapp.org/videos/keypair.webm]

<br>
<div class="alert-message error">
<p>One last note about UAC, Pageant & Git</p>  
</div>
If you have UAC turned on (which it is by default on Windows Vista and Windows 7) if you run Git from an a elevated command prompt, you need to make sure that pageant is elevated as well, otherwise plink and Git can't talk to it to get your private key.
