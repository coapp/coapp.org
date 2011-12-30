---
layout: 'article'
title: 'Modifying the CoApp Website'
version: 1.0
docid: 'developer:modifywebsite'
---
### Requirements
You need to make sure that you've [checked out the website source code][developer:checkoutwebsite], and can run the site generator.

#### Website Project Layout

The CoApp website project is built using a static-site generator called DocPad, written in coffee-script (which actually uses node.js and runs as JavaScript).

The generator (along with node.js) is entirely contained within the project, so no additional tools are needed.

The project as a whole is laid out in the following form:

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

Unless you plan on making changes to DocPad itself, most of that isn't of much concern.

The "source code" to the website content is all contained in the `src` folder.


#### Website Content Layout

The overall layout of the `src` folder is as follows:
``` text
src
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

The website content is essentially composed of 4 parts:

##### Static Content
The *static content* of the website is just that--files that are copied verbatim without modification to the final website. Images, client-side-scripts and some CSS can be found in this section.

All of the static content is copied as a tree into the root of the target website.

##### Dynamic Content
The *dynamic content* of the website consists of files that are transfomed in one way or another. The transformation they go thru is specified by the extensions that a given file has.  Reading from the end of the file backwards, you can see the transformations a given file will go thru.

For example, a file named `index.html.md.ejs` will go from an `ejs`(embedded javascript template) file to `md` (markdown) and finally `html` .  DocPad will run the different transformers on the file as it makes its way thru the pipeline.

Before the content is transformed, there is an optional section at the top of any text file called the "Front Matter", in a [format called `yaml`](#yaml). You can think of the front matter as the ability to set some variables for the page before it makes its journey thru the transformation pipeline.

The different formats that are generally used in CoApp's Website are:

<table class="zebra-striped">
    <thead><tr><th>Extension</th><th>Format</th><th>Details</th></tr></thead><tbody>
    <tr><td>.ejs</td><td>Embedded Javascript Template</td><td>The actual EJS library used is from https://github.com/visionmedia/ejs , however the documentation at the site http://embeddedjs.com/ may be useful for understanding  </td></tr>
    <tr><td>.md</td><td>Markdown</td><td>The CoApp website uses a variant of <a href="http://daringfireball.net/projects/markdown/syntax">markdown</a> called <a href="/reference/garrett-flavored-markdown">garrett-flavored-markdown</a>, which itself is a variant of <a href="http://github.github.com/github-flavored-markdown" >github-flavored-markdown</a>. </td></tr>
    <tr><td>.less</td><td>Lesscss - dynamic css</td><td>You can learn more about lesscss at it's website: http://lesscss.org/</td></tr>
    <tr><td>.styl</td><td>Stylus -- "Expressive CSS"</td><td>Only used in one file, but you can find out more: http://learnboost.github.com/stylus/docs/executable.html</td></tr>
    </tbody>
</table>

##### Layouts 

> TODO : Layouts are how the content is stuffed into pages. For now, if you need to know, ask.

##### Includes

> TODO : Includes are common boxes that go in the side areas (kinda like mini-content) For now, if you need to know, ask.

### [YAML Front matter](!yaml)
Each file can declare some values that are passed to the transformation pipeline.

YAML must always appear at the very beginning of the file, and always starts and ends with triple-dash (`---`) on a line by iself:

``` yaml
---
layout: 'article'
title: 'Modifying the CoApp Website'
version: 1.0
docid: 'developer:modifywebsite'
---
```

<table class="zebra-striped" >
    <thead><tr><th>Header Variable</th><th>Pages Used</th><th>Purpose</th></tr></thead><tbody>
    <tr><td>layout</td><td>All Pages</td><td>Determines what template (or chain of templates, as a layout template can refer to another) is used for the page.</td></tr>
    <tr><td>title</td><td>All Pages</td><td>The title is used by the master layout page to set the HMTL title, as well as for metadata in the headers for things like facebook integration.</td></tr>
    <tr><td>version</td><td>Articles</td><td>Article pages can set a version. If the version number changes, the disqus comment thread ID gets changed, and starts a new thread. (this makes it so we can 'dump' old threads when they cease to be relevant)</td></tr>
    <tr><td>docid</td><td>All Pages</td><td>Pages can set their docid so that they can use <a href="/reference/garrett-flavored-markdown.html#links">GFM reference links</a> instead of linking to the physical filename </td></tr>
    <tr><td>order</td><td>Top level pages (ones in the <code>src/dynamic/pages</code> folder)</td><td>Order determines what order the pages appear in the top navigation bar.</td></tr>
    <tr><td>rightsideboxes, leftsideboxes</td><td>All Pages*</td><td>Pages can declare 'included' boxes on the left and right side of content</td></tr>
    <tr><td>author</td><td>News posts (blog)</td><td>Blog posts specify the post author.</td></tr>
    <tr><td>twitter</td><td>News posts (blog)</td><td>Blog posts link to the twitter id of the author if specified</td></tr>
    <tr><td>tags</td><td>News posts (blog)</td><td>for tagging blog posts.</td></tr>
    </tbody>
</table>


### [Garrett-Flavored Markdown Guide](!gfm)

Visit the guide for [Garrett Flavored Markdown][gfm]


### [Falling back to HTML](!html)
Markdown (specifically [garrett-flavored-markdown](#gfm) ) doesn't cover all the formatting that is required to build a website, so occasionally we have to fall back to using plain old HTML.

We do however, have an excellent CSS layout foundation provided by [bootstrap](http://twitter.github.com/bootstrap/), so most of what we need is pretty trivial to do.


#### Tables

Markdown doesn't have any support for tables, other than they embed them just fine.
The content in a table must be HTML too--markdown doesn't process inside of tables.

Use the following template for laying out tables:
``` html
<table class="zebra-striped" >
    <thead><tr>
        <th>Column1 Header</th>
        <th>Column2 Header</th>
        <th>Column3 Header</th>
    </tr></thead>
    <tbody>
        <tr>
            <td>text</td>
            <td>text</td>
            <td>text</td>
        </tr>
        <tr>
            <td>text2</td>
            <td>text2</td>
            <td>text2</td>
        </tr>
    </tbody>
</table>
```

Which will render a table that looks like:
<table class="zebra-striped" >
    <thead><tr>
        <th>Column1 Header</th>
        <th>Column2 Header</th>
        <th>Column3 Header</th>
    </tr></thead>
    <tbody>
        <tr>
            <td>text</td>
            <td>text</td>
            <td>text</td>
        </tr>
        <tr>
            <td>text2</td>
            <td>text2</td>
            <td>text2</td>
        </tr>
    </tbody>
</table>

#### Labels

Bootstrap provides excellent label support:
<table class="zebra-striped" >
    <thead>
        <tr>
        <th style="width: 50%;">Label</th>
        <th>Result</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>
        <code>&lt;span class="label"&gt;Default&lt;/span&gt;</code>
        </td>
        <td>
        <span class="label">Default</span>
        </td>
        </tr>
        <tr>
        <td>
        <code>&lt;span class="label success"&gt;New&lt;/span&gt;</code>
        </td>
        <td>
        <span class="label success">New</span>
        </td>
        </tr>
        <tr>
        <td>
        <code>&lt;span class="label warning"&gt;Warning&lt;/span&gt;</code>
        </td>
        <td>
        <span class="label warning">Warning</span>
        </td>
        </tr>
        <tr>
        <td>
        <code>&lt;span class="label important"&gt;Important&lt;/span&gt;</code>
        </td>
        <td>
        <span class="label important">Important</span>
        </td>
        </tr>
        <tr>
        <td>
        <code>&lt;span class="label notice"&gt;Notice&lt;/span&gt;</code>
        </td>
        <td>
        <span class="label notice">Notice</span>
        </td>
        </tr>
    </tbody>
</table>

#### Alert Messages
Bootstrap supports alert messages that you can use in paragraph blocks with `class="alert-message"` class declaration (along with an optional `success`, `warning`, `error`, or `info`)

``` html
<p class="alert-message error">
    Danger! This is important! See? You Looked?
</p>
```

Renders as : 

<p class="alert-message error">
    Danger! This is important! See? You Looked?
</p>


#### Block Messages
Bootstrap also gives us very nice block messages-- You can use paragraph blocks with `class="alert-message block-message"` class declaration (along with an optional `success`, `warning`, `error`, or `info`)

``` html
<p class="alert-message block-message success">
    This message shows something important that you should consider ... 
</p>
```

Renders as:

<p class="alert-message block-message success">
    This message shows something important that you should consider ... 
</p>
