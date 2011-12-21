# CoApp Website Source Code

This is the soruce code to the new CoApp website, which is statically generated using a fork of [DocPad](https://github.com/balupton/docpad).

Everything you need to rebuild and test the content is including in the repository, so you should be able to just check this out 
and run:

```
    server.cmd
```


And it will start the website test server that will regenerate the static content every time you save a file (anywhere in ./src)

The website itself will be generated into the ./out directory as a completely static website.

You can also manually generate the static content by running the 

```
    generate.cmd
```
script. This does the same thing, except doesn't actually run a mini-http server (or watch for changes)

## Understanding the layout of the website

```
+ src
   | 
   |-- dynamic           -- All the dynamic content of the website is in here
   |-- includes          -- These are snippets of ejs/md/html code that 
   |                        can be included in multiple pages. (ie, sideboxes) 
   |-- layouts           -- The layout files allow us to abstract page layout 
   |                        into common files where the dynamic content can 
   |                        reference them
   |-- static            -- any content that can be just copied verbaitm into 
                            the website 
     
```

## The workflow of generating content.

Files in the dynamic section of the website can get transformed from one format to another, and can pass thru multiple 
formats before generating the final static file.

Each file has one or more extensions, and reading from the end towards the beginning, you will see the transformations that the page will go thru:

Some Examples:

```
  foo.css.less          -- a .less file that gets transformed into a .css file
  
  foo.html.md           -- a markdown file that gets transformed into html
  
  foo.html.md.ejs       -- an Embedded Javascript file that transforms into a markdown 
                           and then into a html file.
```

At generation time, the dynamic content is transformed and copied along with the static content into the output directory.

