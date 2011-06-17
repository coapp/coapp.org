---
layout: post
title: "More Testing."
guid: http://www.coapp.org/2011/06/02/more-testing/
categories:
- news
---

What’s a “shallow-fork” you say?
A fork happens when developers take a copy of source code from one software package and starts independent development on it, creating a distinct piece of software.  A shallow-fork is when the independent development continually brings forward changes from the original project, and attempts not to stray very far from it.  We do this so that we can make appropriate Windows changes (like new build scripts, or better API support) keep compatibility and not break the original project.  If the upstream project is willing to accept changes, great! If not (for whatever reason)… great! Either way, the package maintainer for the CoApp project will aim to keep the projects in sync as much as possible.

Linux distributions do this sort of thing all the time, in order to build packages for their specific version of Linux.  We’re essentially following in the same footsteps, but following the procedure that I’m setting out here, so that we can eventually produce packages of software for CoApp.

{% highlight c# %}
// *** Example Three ***
// Listening to multiple events
var taskThree = CoTask.Factory.StartNew(() => {
    for (var q = 10; q > 0; q--) {
        // simulate a longer running operation
        Thread.Sleep(200);
 {% endhighlight %}


{% highlight c# %}
// *** Example Three ***
// Listening to multiple events
var taskThree = CoTask.Factory.StartNew(() => {
    for (var q = 10; q > 0; q--) {
        // simulate a longer running operation
        Thread.Sleep(200);
 
        // fire a different message for different values:
        switch(q % 3) {
            case 0:
                TestEvents.Invoke.Message1("Message1 From taskThree", q);
                break;
            case 1:
                TestEvents.Invoke.Message2("Message2 From taskThree", "Just more text");
                break;
            case 2:
                TestEvents.Invoke.Message3("Message3 From taskThree");
                break;
 
        }
    }
}, new TestEvents {
    Message1 = (aString, anInt) => {
        Console.WriteLine("The Task said a string and an int: [{0}] and [{1}] ", aString, anInt);
    },
    Message2 = (aString1, aString2) => {
        Console.WriteLine("The Task said two strings: [{0}] and [{1}] ", aString1, aString2);
    }
} );
 
Console.WriteLine("\r\n(Main Thread Completed)======>Press Enter to end.\r\n");
Console.ReadLine()
{% endhighlight %}


What’s a “shallow-fork” you say?
A fork happens when developers take a copy of source code from one software package and starts independent development on it, creating a distinct piece of software.  A shallow-fork is when the independent development continually brings forward changes from the original project, and attempts not to stray very far from it.  We do this so that we can make appropriate Windows changes (like new build scripts, or better API support) keep compatibility and not break the original project.  If the upstream project is willing to accept changes, great! If not (for whatever reason)… great! Either way, the package maintainer for the CoApp project will aim to keep the projects in sync as much as possible.

Linux distributions do this sort of thing all the time, in order to build packages for their specific version of Linux.  We’re essentially following in the same footsteps, but following the procedure that I’m setting out here, so that we can eventually produce packages of software for CoApp.