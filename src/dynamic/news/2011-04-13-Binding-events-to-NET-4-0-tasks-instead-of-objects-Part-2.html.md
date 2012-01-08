---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: Binding Events to .NET 4.0 Tasks instead of Objects (Part 2)
tags: ['developer', 'coding']
docid: "news:201104132"
---

In my [last post][news:201104131], I showed how we're binding event handlers to the Task after it's already been started. This of course, is probably not what you want, as it's possible to lose some events if the task starts up quick enough.

So, the **CoTask** task factory also lets you pass the event listeners as part of the task creation call, you just have to instantiate the TestEvents class and use an object initializer to set the value of the event handler:

``` csharp
// *** Example Two ***
// Listening to events
// but attaching before the task is started
var taskTwo = CoTask.Factory.StartNew(() => {
    for (var q = 10; q > 0; q--) {
        // simulate a longer running operation
        Thread.Sleep(200);

        // that occasionally notifies anyone who cares to listen.
        TestEvents.Invoke.Message1("Message From taskTwo", q);
    }
}, new TestEvents {
    Message1 = (s, i) => {
        Console.WriteLine("The Task said: [{0}] and [{1}] ", s, i);
    }
} );

Console.WriteLine("\r\n(Main Thread Completed)======>Press Enter to end.\r\n");
Console.ReadLine();
```

In line 12 you can see where I just tack on the instance of the TestEvents class as the last parameter in the call to StartNew() .  By passing the event listener earlier, this allows the caller to not miss out on any events:

@[task_0 output screenshot](201104132_task_2.png)

Much Better!

Now, what if the class that had the events in it had more than one event:

``` csharp
public class TestEvents : MessageHandlers<TestEvents> {
    public Action<string, int> Message1;
    public Action<string, string> Message2;
    public Action<string> Message3;
}
```

Well, can go ahead and implement the ones you want, and leave the ones you don't:

``` csharp
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
Console.ReadLine();
```

And when you run that, you see that we're able to handle the messages that we're interested in:

@[task_0 output screenshot](201104132_task_3.png)

Note the lack of messages for **Message3**.

You can also have the Task actually ask for a result from the listener as well-if nobody's listening, it'll return the 'default' value (0 or null) for the type requested:

``` csharp
public class TestEvents : MessageHandlers<TestEvents> {
    public Action<string, int> Message1;
    public Action<string, string> Message2;
    public Action<string> Message3;
    public Func<int, bool> ShouldWeCancel;
}
```

And, a little code showing how it's used:

``` csharp
// *** Example Four ***
// Listening to multiple events
var taskFour = CoTask.Factory.StartNew(() => {
    for (var q = 0; q > 100; q++) {
        // simulate a longer running operation
        Thread.Sleep(200);

        if( TestEvents.Invoke.ShouldWeCancel(q)) {
            // Note: this is not a really good way to actually cancel a Task
            //       you should really use a TaskCancellationSource object
            //       and do it right.
            break;
        }

        // fire a different message for different values:
        switch(q % 3) {
            case 0:
                TestEvents.Invoke.Message1("Message1 From taskFour", q);
                break;
            case 1:
                TestEvents.Invoke.Message2("Message2 From taskFour", "Just more text");
                break;
            case 2:
                TestEvents.Invoke.Message3("Message3 From taskFour");
                break;
        }
    }
}, new TestEvents {
    Message1 = (aString, anInt) => {
        Console.WriteLine("The Task said a string and an int: [{0}] and [{1}] ", aString, anInt);
    },
    Message2 = (aString1, aString2) => {
        Console.WriteLine("The Task said two strings: [{0}] and [{1}] ", aString1, aString2);
    },
    ShouldWeCancel = (anInt) => {
        if( anInt > 12 ) {
            return true;
        }
        return false;
    }
} );

Console.WriteLine("\r\n(Main Thread Completed)======>Press Enter to end.\r\n");
Console.ReadLine();
```

Voila! The task is now asking for information from the listener:

@[task_0 output screenshot](201104132_task_4.png)

You can see that the Task broke out of the loop when the listener responded to the ShouldWeCancel query with true.

There are obviously a few limitations in using a function to get data back from the listener - it's only able to get a value back from the first listener that responds (I've got an idea for how to aggregate up stuff, but not an actual personal use case yet, so unless someone asks, that'll be on the 'todo later' list ... :D) ... and you can't tell the difference between a zero or null response and the lack of response. Still, kinda handy in a couple of cases.

Next time, I'll show you how events bubble their way up - from any code that the Task ends up calling, as well as from any child tasks that are created.