---
layout: post
author: Garrett Serack <a href="http://twitter.com/#!/fearthecowboy">@fearthecowboy</a>
title: CoApp Design Change Meeting Today
tags: meeting news
categories:
- news
---
<b>
Sorry for the short notice, but I’m going to have a conference call this morning to talk about a problem that we’ve run into and how we’re going to solve it.
</b><br>

We have to make some fundamental changes in the architecture of the CoApp engine to work around a problem discovered yesterday afternoon.

The problem, is that when the user double-clicks on an a CoApp MSI, Windows Installer elevates the installer process by switching to the LOCALSYSTEM (NT AUTHORITY\SYSTEM) account, but actively removes a bunch of privileges that they didn’t figure an installer would need—specifically the ability to create symlinks has been removed.

Symlinks are a critical part of CoApp’s design, and I’m not willing to compromise the features that rely on them.

The only way we can get from that crippled LOCALSYSTEM account to a real LOCALSYSTEM account is to create a Win32 service, and spin it up (which we can actually do from that crippled LOCALSYSTEM account), and have it do the work we need done.

Of course, doing this is a fundamental shift, and requires some careful thought and execution.

On the up side, I did anticipate going this direction at some point in the future (V2), so this could be a blessing in disguise.

We can talk about this at the conf call at 10:30 AM PDT this morning.

Everyone is welcome.
G
<hr>
### Meeting Details:
<u><a href="https://join.microsoft.com/meet/garretts/HZ96LF57">Join online meeting</a></u>

<br>Join by Phone
<br> +18883203585
<br> +14257063500

<u><a href="https://join.microsoft.com/dialin">Find a local number</a></u>
<br>Conference ID: 640823217

<a href="http://r.office.microsoft.com/r/rlidOC10?clid=1033&amp;p1=4&amp;p2=1041&amp;pc=oc&amp;ver=4&amp;subver=0&amp;bld=7185&amp;bldver=0">First online meeting?</a>
