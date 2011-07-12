---
layout: post
author: Garrett Serack <a href="http://twitter.com/#!/fearthecowboy">@fearthecowboy</a>
title: An updated feature in CoApp tools
tags: github developer 
categories:
- Developer
---

I’ve added a feature to the command line parsing stuff that makes it simpler to get to the bug tracker for a given tool.

Using <code>--list-bugtracker</code> on the command line will  display the tracker for every loaded assembly that has a bugtracker attribute:

![Alt text](/images/blog/bugtracker.png "show bugtracker example")

This works by adding a new attribute to the AssemblyInfo.cs file for any project in CoApp :

{% highlight c# %}
[assembly: AssemblyBugtracker("https://github.com/coapp/toolkit/issues")]
{% endhighlight %}

Using <code>--open-bugtracker</code> on the command line will now open the default (the one in the EXE, or the first DLL if the EXE doesn’t have one) bug tracker for the tool in the default browser.
