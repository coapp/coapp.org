---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Website Progress
tags: ['news']
---

I've been feverishly trying to write documentation this week ... and at the same time enhancing the DocPad-powered cms engine that's powering the CoApp.org website.

## Layout
Over the last couple of days I've tweaked the layout of the website, and I think it's really starting to come together. Thanks to everyone on IRC who gave their feedback!

## CMS Engine
The site is a statically-generated website that is based off of DocPad, but over the course of the last few days, I've significantly enhanced it with:

- switched to github-flavored-markdown for the markdown processor 

- added the missing triple-backtick (```) syntax-highlighting format for color syntax highlighting  of source code blocks (uses an online pygments webservice)  -- this means no javascript in the browser to do syntax highlighting :)

- enhanced the markdown language with a few new items (turning this slowly into what I call 'garrett-flavored-markdown' ): 

- image embedding with overflow wrapper so the image gets a scrollbar:
> `![alt-text](image-url)`

- video embedding, embeds videos with H.264 and webm codecs for HTML5 and a fallback to flash:
> `% [width,height,posterimageurl,mp4url,webmurl]`

- HTML anchor support (for embedding the target of an anchor) :
> `[text](anchor-id)`

- the ability to smuggle links into color-syntax highlighted code (see the example on the page http://coapp.org/reference/cli.html -- click on the --help in the text):
> `«somecode«href»`

## Stuff to look at!
Please check out the developer articles I've started:

> [Getting setup with git and github](/developers/git.html)
> [Setting up the development environment](/developers/development-environment.html)
> [Check out the source code](/developers/source-code.html)

And the start of the reference work: 
> [Common command-line reference](/reference/cli.html) --  usage information that is common to all/most CoApp command line tools
> [ptk.exe](/reference/ptk.html) -- CoApp 'porting toolkit'

As you can see, I've started to make some 'standards' around what the content looks like, hopefully this will help people start to get a grip on the work that we've been doing.

I'd **love** your feedback, and even more, I'd love any help you can provide. 

## Playing with the CMS:

### The only tools you need to play with the CMS engine is a git and a text editor. **(Not notepad!)**

You can clone the repository:
``` bat
git clone git  @github.com:coapp/coapp.org.git
```

You can run the embedded mini-server by running the command:
``` bat
cd coapp.org
server.cmd
```
> don't worry about any error message right now
> you might get a firewall popup. Say yah, it's ok
> press ctrl-c to stop the server (when you're done, or it does something goofy)

From there, you should be able to see the website in a browser: http://localhost:9778/index.html 

Modify files in the `./src/` directory and below, and the server will automatically regenerate the site (and beep when it's done)... Lather, rinse, repeat.

If you've been putting off getting involved, now is a good time! Come check out the content (yeah, there's lots of 404s yet!)  Feel free to fix them, put in placeholder pages, fix stuff, and send me a pull request on github!

Turn lousy docs into good ones!

If you have any questions, ping me! Come to the IRC channel, just ... do SOMETHING!!

Garrett
