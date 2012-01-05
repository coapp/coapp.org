---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Converting Bazaar repositories to Git
tags: ['developer','coding']
---

I recently moved the CoApp source repositories from Launchpad to github, and I wanted make sure that I preserved all the commit history along with it. Fortunately, it's not too terribly difficult to move from one to the other (provided you jump thru the hoops to getting fast-import working on bzr for Windows).

## Fixing Bzr for Windows

Bzr on Windows supports fast import-except that the installer doesn't install the fast-import python module when it installs python.  Easy enough to fix. You need to grab a copy of the **fast-import** module from launchpad:

``` bat
C:\tmp>bzr clone lp:python-fastimport
Connected (version 2.0, client Twisted)
Authentication (publickey) successful!
Secsh channel 1 opened.
Branched 301 revision(s).
```

And then combine it with the library.zip file that's already in the Bazaar install directory using zip (I used the command line zip utility from infozip)...

``` bat
C:\tmp>cd python-fastimport
 
C:\tmp\python-fastimport>zip -r "c:\Program Files (x86)\Bazaar\lib\library.zip" *
```

Once you've done that, it's really trivial to move a .bzr repository to a git one:

``` bat
C:\tmp>mkdir someproject
 
C:\tmp>cd someproject
 
C:\tmp\someproject>git init
Initialized empty Git repository in C:/tmp/someproject/.git/
 
C:\tmp\someproject>bzr fast-export --plain YOUR-BZR-REPO | git fast-import
```

Where **YOUR-BZR-REPO** is the path to your bazaar repository - it can be a path to a local repo, or a remote location (like, lp:projectname).

It will spit out some information, and then you need to:

``` bat
C:\tmp\someproject>git checkout master
Already on 'master'
```

Now, you've got a shiny new git repo from your bazaar repo, and you can play with it as you will.