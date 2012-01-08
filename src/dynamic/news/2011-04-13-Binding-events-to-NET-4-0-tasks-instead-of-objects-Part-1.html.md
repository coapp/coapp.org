---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: Binding Events to .NET 4.0 Tasks instead of Objects (Part 1)
tags: ['developer', 'coding']
docid: "news:201104131"
---

During the development of CoApp, I've enthusiastically embraced the .NET 4.0 [Task Parallel Library](http://msdn.microsoft.com/en-us/library/dd460717.aspx) (aka, the **TPL**).  It's a set of APIs that make developers more productive by significantly simplifying the process of adding parallelism and concurrency to applications. I got religion around this last fall when I saw the PDC presentation that Anders Hejlsberg gave on [The Future of C# and VB](http://channel9.msdn.com/Events/PDC/PDC10/FT09).  In there Anders talks about the shift to a fully asynchronous programming methodology. While the technology that he spoke of isn't yet ready for production use today, the Task Parallel Library in .NET 4.0 provides the underlying framework that we can take advantage of right now.
Before we get too deep...

I should note that asynchronous code in .NET 4 make rather extensive use of [Lambda Expressions](http://blogs.msdn.com/b/ericwhite/archive/2006/10/03/lambda-expressions.aspx) - If you're not familiar with lambdas, you'd better go get familiar, because this stuff is gonna be a tad hard to understand without it. It's ok, I'll wait...

And, I'm not going to go into too much detail about [the basics of using the TPL](http://msdn.microsoft.com/en-us/library/dd537609.aspx); I recommend that you watch Ander's video (to get an idea of the motivation) and perhaps read thru [Eric Lippert's blog posts on Asynchrony](http://blogs.msdn.com/b/ericlippert/archive/tags/async/) (and really, start with his earlier posts on [Continuation Passing Style](http://blogs.msdn.com/b/ericlippert/archive/tags/continuation+passing+style/))-if you are a .NET developer, this stuff will change your life.

The following is a simple example for how we start an asynchronous task using the TPL:

``` csharp
// *** Example Zero ***
// Starting a task using the TPL
var taskZero = Task.Factory.StartNew(() => {
    for (var q = 10; q > 0; q--) {
        // simulate a longer running operation
        Thread.Sleep(200);

        // Wish we could tell someone about
        // what's going on in this operation
        // and Writeline is hardly a good idea
        // when you are in another thread.
        Console.WriteLine("Progress Message from taskZero", q);
    }
});

Console.WriteLine("(Main Thread Completed)======>Press Enter to end.\r\n");
Console.ReadLine();
```

Which will produce output like:

@[task_0 output screenshot](201104131_task_0.png)

You'll notice that the main thread completes (and is sitting around waiting at the **ReadLine()**) while the Task executes.

## And getting to the point

Ok, so now I can illustrate some code that I've written as part of CoApp that fills a void where I was creating complex asynchronous operations and wanted to be able to broadcast arbitrary events from that operation, without having to pass an object along to each step in the operation.

Let me put this another way...

I'd like to start an operation-say, "Install a package"-and I'd like the calling context to be able to subscribe to events for that particular operation (regardless of what events the operation directly (or indirectly) broadcasts.  Yes, I **could** create a class that has a bunch events, and pass that from function to function in the entire call tree for that operation, but that would be terribly unwieldy, and frankly, would be a real pain when I wanted to reuse other asynchronous tasks as child tasks, and they may not take the same class for events.

Additionally, that asynchronous operation may spawn off additional asynchronous operations of its own-perhaps to download some dependencies-and it'd be nice to be able to pick up download progress notifications so we could show some UI that keeps the user informed as to what's actually going on.

Hrm... Howsabout I explain this with some code.  Let's assume my little task has an event that it'd like to notify. First, we declare a class for the messages:

``` csharp
public class TestEvents : MessageHandlers<TestEvents> {
    public Action<string, int> Message1;
}
```

And then an example of the task firing the event:

``` csharp
// *** Example One ***
// Firing an event
var taskOne = CoTask.Factory.StartNew(() => {
    for (var q = 10; q > 0; q--) {
        // simulate a longer running operation
        Thread.Sleep(200);

        // that occasionally notifies anyone who cares to listen.
        TestEvents.Invoke.Message1("Message From taskOne", q);
    }
});
```

Now,  you should notice two things ('specially since I highlighted the lines...). First, I use my own **CoTask** Task factory instead of the TPL's Task-this just lets me track tasks a bit better, and handles some background work for all this stuff. Functionally, it should be identical, and still returns the same Task objects. Second, I can now use the class I created before to fire off a message (in this case, **Message1** takes a **string** and an **int** for parameters) using some mysterious static Invoke dohickey on my **TestEvents** class.

Of course, nothing is listening to the events yet, let's wire that up:

``` csharp
// perhaps we'll slack off for a while
Thread.Sleep(400);

// start listening to messages after the task has started.
// (we probably missed some!)
((TestEvents)taskOne).Message1 += (aString, anInt ) => {
    Console.WriteLine("The Task said: [{0}] and [{1}] ", aString, anInt);
};

Console.WriteLine("(Main Thread Completed)\r\n**Press Enter to end**")
Console.ReadLine();
```

When we run this, we'll end up with some rather interesting output:

@[task_1 output screenshot](201104131_task_1.png)

Shiny! You'll notice in this example, that we've actually missed a couple of events (exacerbated by the **Thread.Sleep()** in line 2.). Regardless, the main thread completes and waits, and you can see my event handler in the lambda expression is getting called.

The beauty of this approach is that we can see how I can launch a longer running operation, and accept events from it, without having to explicitly tell the code in the operation about the event listener.

In the next part as I dig deeper, I'll show how we can ensure we never miss our messages, and how we can listen for more than one at a time.