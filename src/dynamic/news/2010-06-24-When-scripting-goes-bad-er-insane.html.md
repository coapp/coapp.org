---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: When scripting goes bad...er, insane.
tags: ['developer', 'coding']
docid: "news:20100624"
---

Hi, my name is Garrett, and I have a problem.

I love scripting stuff. And, I by stuff, I mean everything. Really, I often use it as an exercise to understanding whatever it is that I'm trying to learn - if I can automate it, I've got a strong feeling that I understand it.

As you may or may not know, my absolute favorite language is JavaScript (and its many incarnations, like JScript). My love for JavaScript even predates the existence of JavaScript - I heavily used a scripting language called C - (C minus minus aka 'Cmm', later renamed to ScriptEase). A somewhat forgotten company called **Nombas** had written it. A clip from the wayback machine (http://bit.ly/dCjRd9):

> In 1992 and 1993 Nombas developed a language named Cmm (for C minus minus, or "C
> without the hard stuff") for use as an embeddable scripting language, showing that
> it was possible to have a full-powered language that was simple enough to replace
> macro languages. Years later we would change the language name to ScriptEase, because
> Cmm was "too negative, and the letter 'C' scared people". Cmm was first released in a
> shareware product called CEnvi, which won awards and fame and is now available as ScriptEase:Desktop.


> When Netscape's first commercial browsers were released we made a version of CEnvi that
> could handle short scripts embedded within web pages. By embedded scripts within the
> page we allowed the client side to handle processing, rather than making all dynamic
> interaction happen on the server. This brought immediate client-side interaction with
> the user. The advantages of client-side handling were made obvious by Nombas' "Espresso
> Pages", and Netscape soon began work on their own version, which they called LiveScript,
> and then renamed to JavaScript just before its final release.

Cmm and JavaScript were so similar anyway, it was inevitable that one of them would perform the necessary course corrections and become like the other.  Regardless of the specific flavor, for me, the notion of a dynamic c-style scripting language has always had extremely strong appeal.

Over the last 15 or so years, I continued to use JavaScript (or JScript) whenever I needed a script, and I've been very happy.  As well, I continued to refine some of my scripting techniques and create some rather clever hacks to do a lot of the things I needed to do.

The real problem began when I needed to do some batch scripting-that is some useful scripting of command lines and whatnot. On Windows (out of the box), there are only a couple of options: Batch scripting with CMD, and in later years, PowerShell. For a long time, I used CMD Batch Scripting for lots of this, but it's so ... so ... nasty. You really don't want to do serious work in there, it's just not up to the task.

PowerShell should have made me ecstatic-a .NET language, with access to pretty much everything I ever wanted in a scripting language, tons of support, and clearly the answer to my problems.  Unfortunately, that syntax breaks my brain. I just can't get natural with it, no matter how much I've tried.

So, a couple of years ago, I started writing a nifty library that allowed me to make complicated batch scripts using JScript; and it's been working out nicely. I get access to everything in the OS that I need, the language is installed on every version of Windows that I have used, and it doesn't require any magic to make work.  Over time, I've added in code to do some 'theoretically impossible' tasks in JScript, including:

* full support for batch scripting (capturing and using the results of other command line apps)
* full use of environment variables in scripting
* formatted string handling
* binary file read and write (and they said it couldn't be done)
* some basic file assertions
* http downloading
* logging
* PE executable identification
* process management
* an extensible library interface and libraries for Restore Points, Speech (SAPI), JSON, MD5, Hyper-V VHD handling, and a twisted on-the-fly C# compiler.

And probably some other things I can't remember.

## Here's where it starts to get weird

Then, last night I was doing some more batch scripting at home, and I had my insane idea. What if I wrote a script that transformed a batch-like script language into JScript, and executed it. And, just because I'm that crazy, I'll write it in JScript too.

And now, a scan hundred or so lines later, my latest script language is born. I call it 'gs' - short for gScript... a cousin to my other (unreleased) scripting language g#.

A quick little example script:

``` text
// comments are still slashies
 
// you can execute command lines just like regular batch languages:
// (this just prints the robocopy usage)
robocopy
 
// Or you can capture the results of a command:
// (this uses the command processor to get a list of files (as text))
var $RESULT = cmd /c dir /b c:\*.zip
 
// there are built-in commands:
// so far cd, md, rd, erase, echo, dir
echo {$RESULT}
 
// and when you want to do some jscript, start a jscript block:
js {
    // this is a jscript code block
    //any legal jscript is ok here!
 
    // of course, you have access to the js.js function library:
    print("hello World");
 
    // and functions work just fine:
    function foo() {
 
        // you can even run batch commands from where with hash-bang:
        $WGETHELP = #! wget --help
 
        #! cmd.exe /c ver
 
        // output from the last command is always captured as an array in
        // $StdOut and as a string in $StdOutString
        print($StdOutString);
 
        return $WGETHELP;
    }
 
}
 
// oh, and for loops work outside the js blocks in the batch-world too:
// prints out text:
for(var i=0;i<10;i++)
    echo {$RESULT} {i}
```

using the gs script runner to run this:

``` text
C:\>gs test.gs
 
( or, to dump the processed script out )
 
C:\>gs /debug test.gs
 
// comments are still slashies
 
// you can execute command lines just like regular batch languages:
// (this just prints the robocopy usage)
$$("robocopy");
 
// Or you can capture the results of a command:
// (this uses the command processor to get a list of files (as text))
var $RESULT = $$.RunQuiet("cmd /c dir /b c:\\*.zip");
 
// there are built-in commands:
// so far cd, md, rd, erase, echo, dir
print('{$RESULT}');
 
// and when you want to do some jscript, start a jscript block:
 
    // this is a jscript code block
    //any legal jscript is ok here!
 
    // of course, you have access to the js.js function library:
    print("hello World");
 
    // and functions work just fine:
    function foo() {
 
        // you can even run batch commands from where with hash-bang:
        $WGETHELP = $$.RunQuiet("wget --help");
 
        $$("cmd.exe /c ver");
 
        // output from the last command is always captured as an array in
        // $StdOut and as a string in $StdOutString
        print($StdOutString);
 
        return $WGETHELP;
    }
 
// oh, and for loops work outside the js blocks in the batch-world too:
// prints out text:
for(var i=0;i<10;i++)
print('{$RESULT} {i}');
```

I've skimmed over so much of how this all works, but feel free to play with the code.  Some of this I published earlier in my gsToolkit project on Codeplex.  I'm using all of this in the CoApp project for a variety of tasks, so I'm publishing the whole set in a [CoApp](http://coapp.org) project.