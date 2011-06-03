---
layout: post
title: "The First Post Ever"
guid: http://www.coapp.org/2011/06/02/the-first-post-ever/
postid: 5
categories:
- site-news
- 
- shiny
- 
- happy
- 
- people
- 
- friendly
---
this is a test @

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
Console.ReadLine(){% endhighlight %}

why no work?I'd like to introduce a new member of our team; Tim Rogers.
 
Tim is a new full time employee at Microsoft who started this week, and as he just found out yesterday (his first day in the office), is going to be working as a full-time test resource for CoApp.
 
Tim has a few words about himself;
 
"Tim Rogers is new to Microsoft, fresh out of college.  He has been living in Iowa, attending Iowa State University.  Major interests include technical theater, bicycles, strategy games, and reading.  Tim insists that he is a boring and unimaginative person, so throwing rocks and other things at him is to be encouraged.  This bio was written by the aforementioned boring and unimaginative person.

Feel free to adjust or make things up to your hearts content."
 
Apparently, Tim likes to talk about himself in the third person.
 
Tim is going to start by tackling the orchestration and test writing for the CoApp engine—the component that gets the most end-user exposure.
 
As he gets up to speed, he’ll likely start blogging and filling in the documentation where he can as well.
 
 
The Garrett welcomes Tim!
 