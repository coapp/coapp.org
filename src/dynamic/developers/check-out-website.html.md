---
layout: 'article'
title: 'Checking out the source code for the CoApp Website' 
version: '1.0'
docid: "developer:checkoutwebsite"
---

## Requirements:
You'll need the following in order to correctly set up your development environment for working on CoApp:

- **Git, putty, and a github account** -- see [Getting setup with git and github](/developers/git.html)
- a text editor (and not just **notepad**) Suggestions: [Notepad++](http://notepad-plus-plus.org/download/v5.9.6.2.html), [SciTE](http://opensource.ebswift.com/SciTEInstaller/)

You don't need any other special software to work with the Website source code. 

### Fork the CoApp website 

The CoApp website (the one you're currently reading) is available in source form from the [github project](http://github.com/coapp/coapp.org).

The git repository for the CoApp project is found at: `git@github.com:coapp/coapp.org.git`

The easiest way to collaborate in the CoApp documentation development is to follow the [Fork + Pull Model](http://help.github.com/send-pull-requests/) well defined and supported by GitHub.

Follow the [Fork A Repo](http://help.github.com/fork-a-repo/) guide to set up your own fork of repository

`git@github.com:coapp/coapp.org.git`

at your own location:

`git@github.com:username/coapp.org.git`

where `username` is your GitHub user name.

Then, you will be ready to check out and work with the CoApp website source code.

### Checking out the CoApp website

To check out the website's source code from the command prompt, you can run the following:

``` bat
REM Assuming that you want to work in the c:\project\ folder:

c:\> mkdir c:\project
c:\> cd c:\project

c:\project\> git clone --recursive git@github.com:username/coapp.org.git
```

It will run for a bit (it takes time to do the initial checkout):

When it's done you will see something similar to this:

``` bat
c:\project>git clone --recursive git@github.com:username/coapp.org.git
Cloning into coapp.org...
remote: Counting objects: 4542, done.
remote: Compressing objects: 100% (3352/3352), done.
remote: Total 4542 (delta 899), reused 4359 (delta 716)
Receiving objects: 100% (4542/4542), 8.46 MiB | 130 KiB/s, done.
Resolving deltas: 100% (899/899), done.

c:\project>
```

A quick reminder: `username` stands for your own GitHub user name.

### Configuring git remotes

If the CoApp website in the repository you forked from gets updated, you can add those updates to your fork:

``` bat
c:\project\>cd coapp.org
c:\project\coapp.org\>git remote add upstream git@github.com:username/coapp.org.git
c:\project\coapp.org\>git fetch upstream
c:\project\coapp.org\>git merge upstream/master
```

The overall workflow of fetching and merging upstream changes as well as pushing your commits to the fork is described in the [Fork A Repo](help.github.com/fork-a-repo/) guide. So, refer to this guide for details if needed.

### Running the DocPad site generator 

The DocPad site generator runs in two modes: *Server* and *Generate*.


**Generate** just regenerates the website into the `out` folder and then exits.

**Server** starts a mini webserver and watches the `src` folder for changes, and regenerates the website every time a file is changed. The website generates in about 10-15 seconds.  Once the server is running you can preview the website with a browser pointed to http://localhost:9778/index.html .

##### Running DocPad in Generate mode
You can run the DocPad in generate mode by just running the `generate.cmd` script found in the project folder:

``` bat
c:\project\> cd coapp.org

c:\project\coapp.org\> generate.cmd 
```

You should see:

@[Running docpad in Generate mode](checkout-website-2.png)

##### Running DocPad in Server mode
You can run the DocPad by just running the `server.cmd` found in the project folder:

``` bat
c:\project\> cd coapp.org

c:\project\coapp.org\> server.cmd 
```
You should see:

@[Running docpad in Server mode](checkout-website-3.png)

and you can open up a browser:

@[Running docpad in Server mode](checkout-website-4.png)

Press CTRL-C a couple of times to stop the server.


