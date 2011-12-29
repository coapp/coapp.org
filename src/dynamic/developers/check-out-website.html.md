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

### Checking out the website

The CoApp website (the one you're currently reading) is available in source form from the [github project](http://github.com/coapp/coapp.org).

The git repository for the CoApp project is found at :  `git @github.com:coapp/coapp.org.git`

To check out the website's source code from the command prompt, you can run the following:

``` bat
REM Assuming that you want to work in the c:\project\ folder:

c:\> mkdir c:\project
c:\> cd c:\project

c:\project\> git clone --recursive  git@github.com:coapp/coapp.org.git 

```

It will run for a bit (it takes time to do the initial checkout):

When it's done you will see something like:

@[Checking out the website](checkout-website-1.png)

### Running the DocPad site generator 

The DocPad site generator runs in two modes: *Server* and *Generate*.


**Generate** just regenerates the website into the `out` folder and then exits.

**Server** starts a mini webserver and watchs the `src` folder for changes, and regenerates the website every time a file is changed. The website generates in about 10-15 seconds.  Once the server is running you can preview the website with a browser pointed to http://localhost:9778/index.html .

##### Running DocPad in Generate mode
You can run the DocPad in generate mode by just running the `generate.cmd` script found in the project folder:

``` bat
c:\project\> cd coapp.org

c:\project\> generate.cmd 
```

You should see:

@[Running docpad in Generate mode](checkout-website-2.png)

##### Running DocPad in Server mode
You can run the DocPad by just running the `server.cmd` found in the project folder:

``` bat
c:\project\> cd coapp.org

c:\project\> server.cmd 
```
You should see:

@[Running docpad in Server mode](checkout-website-3.png)

and you can open up a browser:

@[Running docpad in Server mode](checkout-website-4.png)

Press ctrl-c a couple of times to stop the server.


