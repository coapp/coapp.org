---
layout: 'article'
title: 'Modifying the CoApp Website'
version: 0.5
docid: 'developer:modifywebsite'
---
### Requirements
You need to make sure that you've [checked out the website source code][developer:checkoutwebsite].

#### Website Project Layout

``` text
├───documentation                   // documentation for components used to build the website
│   └───bootstrap                   // documentation for bootstrap (the base css layout we use)
├───node_modules                    // the node.js modules that make up the DocPad system
│   ├───coappcms                    // nearly all the custom work in docpad for CoApp is here
│   ├───coffee-script               
│   ├───docpad
│   ├───ejs                         // ejs is the javascript templating engine (when you see .html.ejs)
│   ├───enumerable                  // a linq-like library for javascript. 
│   ├───express
│   ├───github-flavored-markdown    // the basis for the markdown support (the rest is in coappcms)
│   └───MD5                         
├───out                             // the output of the generate command dumps in here
├───plugins                         // DocPad plugin modules (in coffee-script, ew!)
│   ├───coappmarkdown               // the skeleton plugin (real guts are in coappcms above)
│   ├───ejs 
│   └───totaldocuments
├───src                             // the website content (see below)
└───tools                           // the binary tools needed to generate the site (node.js, etc)
```

#### Website Content Layout
...
``` text
├───dynamic                         // all the dynamic content in the website is under here
│   │
│   ├───developers                  // developer pages
│   ├───help                        // help pages
│   ├───news                        // blog posts
│   ├───pages                       // top-level pages
│   ├───reference                   // reference pages
│   ├───scripts                     // client side javascript files that are transformed before sent out
│   └───styles                      // css (.less to .css) files -- all style info in heree
│       └───bootstrap               // bootstrap css files
│
├───includes                        // these are small templates that can be included in multiple pages.
├───layouts                         // these contain the layouts for all the pages in the site
└───static                          // all static content (things that don't change at generation time) are here
    ├───images                      // image files go in here
    │   ├───blog
    │   ├───Flags
    │   ├───player
    │   ├───social
    │   └───tutorials
    ├───scripts                     // client-side javascript
    │   └───bootstrap               // bootstrap client-side scripts
    └───styles                      // static css files
```