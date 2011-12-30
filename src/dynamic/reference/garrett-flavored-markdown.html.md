---
layout: 'article'
title: 'Garrett Flavored Markdown Reference Guide' 
version: '1.0'
docid: 'gfm'
---
<script>
$(document).ready(function() {
  $(".more_content").hide();
  $(".show_more").click(function() {
    $(this).next(".less_content").slideToggle(600);
    $(this).next(".less_content").next(".more_content").slideToggle(600);
  });
});
</script>

<div class="alert-message block-message success">
    <p>The Markdown reference on this page is composed of content from <a href="http://daringfireball.net/projects/markdown/syntax">the original markdown site</a> as well as the <a href="http://github.github.com/github-flavored-markdown/">github site</a>. <br> You will find github-flavored-markdown and garrett-flavored-markdown variants highlighted within the document.</p>
</div>


Markdown: Syntax
================


*   [Overview](#overview)
    *   [Philosophy](#philosophy)
    *   [Inline HTML](#html)
    *   [Automatic Escaping for Special Characters](#autoescape)
*   [Block Elements](#block)
    *   [Paragraphs and Line Breaks](#p)
    *   [Headers](#header)
    *   [Blockquotes](#blockquote)
    *   [Lists](#list)
    *   [Code Blocks](#precode)
    *   [Horizontal Rules](#hr)
*   [Span Elements](#span)
    *   [Links](#link)
    *   [Emphasis](#em)
    *   [Code](#code)
    *   [Images](#img)
*   [Miscellaneous](#misc)
    *   [Backslash Escapes](#backslash)
    *   [Automatic Links](#autolink)


**Note:** This document is itself written using Markdown; you can [see the source for it by looking at the source in github][src].

  [src]: https://github.com/coapp/coapp.org/blob/master/src/dynamic/developers/modify-website.html.md

* * *

<h2 id="overview">Overview</h2>

<h3 id="philosophy">Philosophy</h3>

Markdown is intended to be as easy-to-read and easy-to-write as is feasible.

Readability, however, is emphasized above all else. A Markdown-formatted document should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions. While Markdown's syntax has been influenced by several existing text-to-HTML filters -- including [Setext] [1], [atx] [2], [Textile] [3], [reStructuredText] [4], [Grutatext] [5], and [EtText] [6] -- the single biggest source of inspiration for Markdown's syntax is the format of plain text email. 

  [1]: http://docutils.sourceforge.net/mirror/setext.html
  [2]: http://www.aaronsw.com/2002/atx/
  [3]: http://textism.com/tools/textile/
  [4]: http://docutils.sourceforge.net/rst.html
  [5]: http://www.triptico.com/software/grutatxt.html
  [6]: http://ettext.taint.org/doc/

To this end, Markdown's syntax is comprised entirely of punctuation characters, which punctuation characters have been carefully chosen so as to look like what they mean. E.g., asterisks around a word actually look like \*emphasis\*. Markdown lists look like, well, lists. Even blockquotes look like quoted passages of text, assuming you've ever used email.

<h3 id="html">Inline HTML</h3>

Markdown's syntax is intended for one purpose: to be used as a format for *writing* for the web.

Markdown is not a replacement for HTML, or even close to it. Its syntax is very small, corresponding only to a very small subset of HTML tags. The idea is *not* to create a syntax that makes it easier to insert HTML tags. In my opinion, HTML tags are already easy to insert. The idea for Markdown is to make it easy to read, write, and edit prose. HTML is a *publishing* format; Markdown is a *writing* format. Thus, Markdown's formatting syntax only addresses issues that can be conveyed in plain text.

For any markup that is not covered by Markdown's syntax, you simply use HTML itself. There's no need to preface it or delimit it to indicate that you're switching from Markdown to HTML; you just use the tags.

The only restrictions are that block-level HTML elements -- e.g. `<div>`, `<table>`, `<pre>`, `<p>`, etc. -- must be separated from surrounding
content by blank lines, and the start and end tags of the block should not be indented with tabs or spaces. Markdown is smart enough not to add extra (unwanted) `<p>` tags around HTML block-level tags.

For example, to add an HTML table to a Markdown article:

    This is a regular paragraph.

    <table>
        <tr>  <td>Foo</td></tr>
    </table>

    This is another regular paragraph.

Note that Markdown formatting syntax is not processed within block-level HTML tags. E.g., you can't use Markdown-style `*emphasis*` inside an HTML block.

Span-level HTML tags -- e.g. `<span>`, `<cite>`, or `<del>` -- can be used anywhere in a Markdown paragraph, list item, or header. If you want, you can even use HTML tags instead of Markdown formatting; e.g. if you'd prefer to use HTML `<a>` or `<img>` tags instead of Markdown's link or image syntax, go right ahead.

Unlike block-level HTML tags, Markdown syntax *is* processed within span-level tags.


<h3 id="autoescape">Automatic Escaping for Special Characters</h3>

In HTML, there are two characters that demand special treatment: `<` and `&`. Left angle brackets are used to start tags; ampersands are used to denote HTML entities. If you want to use them as literal characters, you must escape them as entities, e.g. `&lt;`, and `&amp;`.

Ampersands in particular are bedeviling for web writers. If you want to write about 'AT&T', you need to write '`AT&amp;T`'. You even need to escape ampersands within URLs. Thus, if you want to link to:

    http://images.google.com/images?num=30&q=larry+bird

you need to encode the URL as:

    http://images.google.com/images?num=30&amp;q=larry+bird

in your anchor tag `href` attribute. Needless to say, this is easy to forget, and is probably the single most common source of HTML validation errors in otherwise well-marked-up web sites.

Markdown allows you to use these characters naturally, taking care of all the necessary escaping for you. If you use an ampersand as part of an HTML entity, it remains unchanged; otherwise it will be translated into `&amp;`.

So, if you want to include a copyright symbol in your article, you can write: 

    &copy;

and Markdown will leave it alone. But if you write: 

    AT&T

Markdown will translate it to:

    AT&amp;T

Similarly, because Markdown supports [inline HTML](#html), if you use angle brackets as delimiters for HTML tags, Markdown will treat them as such. But if you write:

    4 < 5

Markdown will translate it to:

    4 &lt; 5

However, inside Markdown code spans and blocks, angle brackets and ampersands are *always* encoded automatically. This makes it easy to use Markdown to write about HTML code. (As opposed to raw HTML, which is a terrible format for writing about HTML syntax, because every single `<` and `&` in your example code needs to be escaped.)

* * *


<h2 id="block">Block Elements</h2>

<h3 id="p">Paragraphs and Line Breaks</h3>

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines. (A blank line is any line that looks like a blank line -- a line containing nothing but spaces or tabs is considered blank.) Normal paragraphs should not be indented with spaces or tabs.

<p class="alert-message block-message info"><i><b>New with Github-Flavored-Markdown</b></i><br><br>
<b>Linebreaks</b></br>
The biggest difference that GFM introduces is in the handling of linebreaks. With regular markdown you can hard wrap paragraphs of text and they will be combined into a single paragraph. We find this to be the cause of a huge number of unintentional formatting errors. GFM treats newlines in paragraph-like content as real line breaks, which is probably what you intended.
</p>

The next paragraph contains two phrases separated by a single newline character:

<pre>Roses are red
Violets are blue
</pre>
becomes

Roses are red
Violets are blue

<h3 id="header">Headers</h3>

Markdown supports two styles of headers, [Setext] [1] and [atx] [2].

Setext-style headers are "underlined" using equal signs (for first-level
headers) and dashes (for second-level headers). For example:

    This is an H1
    =============

    This is an H2
    -------------

Any number of underlining `=`'s or `-`'s will work.

Atx-style headers use 1-6 hash characters at the start of the line,
corresponding to header levels 1-6. For example:

    # This is an H1

    ## This is an H2

    ###### This is an H6

Optionally, you may "close" atx-style headers. This is purely cosmetic -- you can use this if you think it looks better. The closing hashes don't even need to match the number of hashes used to open the header. (The number of opening hashes determines the header level.) :

    # This is an H1 #

    ## This is an H2 ##

    ### This is an H3 ######


<h3 id="blockquote">Blockquotes</h3>

Markdown uses email-style `>` characters for blockquoting. If you're familiar with quoting passages of text in an email message, then you
know how to create a blockquote in Markdown. It looks best if you hard wrap the text and put a `>` before every line:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    > 
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

Markdown allows you to be lazy and only put the `>` before the first line of a hard-wrapped paragraph:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

Blockquotes can be nested (i.e. a blockquote-in-a-blockquote) by adding additional levels of `>`:

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

Blockquotes can contain other Markdown elements, including headers, lists, and code blocks:

	> ## This is a header.
	> 
	> 1.   This is the first list item.
	> 2.   This is the second list item.
	> 
	> Here's some example code:
	> 
	>     return shell_exec("echo $input | $markdown_script");

Any decent text editor should make email-style quoting easy. For example, with BBEdit, you can make a selection and choose Increase Quote Level from the Text menu.


<h3 id="list">Lists</h3>

Markdown supports ordered (numbered) and unordered (bulleted) lists.

Unordered lists use asterisks, pluses, and hyphens -- interchangably -- as list markers:

    *   Red
    *   Green
    *   Blue

is equivalent to:

    +   Red
    +   Green
    +   Blue

and:

    -   Red
    -   Green
    -   Blue

Ordered lists use numbers followed by periods:

    1.  Bird
    2.  McHale
    3.  Parish

It's important to note that the actual numbers you use to mark the list have no effect on the HTML output Markdown produces. The HTML Markdown produces from the above list is:

    <ol>
    <li>Bird</li>
    <li>McHale</li>
    <li>Parish</li>
    </ol>

If you instead wrote the list in Markdown like this:

    1.  Bird
    1.  McHale
    1.  Parish

or even:

    3. Bird
    1. McHale
    8. Parish

you'd get the exact same HTML output. The point is, if you want to, you can use ordinal numbers in your ordered Markdown lists, so that the numbers in your source match the numbers in your published HTML. But if you want to be lazy, you don't have to.

If you do use lazy list numbering, however, you should still start the list with the number 1. At some point in the future, Markdown may support starting ordered lists at an arbitrary number.

List markers typically start at the left margin, but may be indented by up to three spaces. List markers must be followed by one or more spaces or a tab.

To make lists look nice, you can wrap items with hanging indents:

    *   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
        viverra nec, fringilla in, laoreet vitae, risus.
    *   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
        Suspendisse id sem consectetuer libero luctus adipiscing.

But if you want to be lazy, you don't have to:

    *   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
    *   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing.

If list items are separated by blank lines, Markdown will wrap the items in `<p>` tags in the HTML output. For example, this input:

    *   Bird
    *   Magic

will turn into:

    <ul>
    <li>Bird</li>
    <li>Magic</li>
    </ul>

But this:

    *   Bird

    *   Magic

will turn into:

    <ul>
    <li><p>Bird</p></li>
    <li><p>Magic</p></li>
    </ul>

List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either 4 spaces or one tab:

    1.  This is a list item with two paragraphs. Lorem ipsum dolor
        sit amet, consectetuer adipiscing elit. Aliquam hendrerit
        mi posuere lectus.

        Vestibulum enim wisi, viverra nec, fringilla in, laoreet
        vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
        sit amet velit.

    2.  Suspendisse id sem consectetuer libero luctus adipiscing.

It looks nice if you indent every line of the subsequent paragraphs, but here again, Markdown will allow you to be lazy:

    *   This is a list item with two paragraphs.

        This is the second paragraph in the list item. You're
    only required to indent the first line. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit.

    *   Another item in the same list.

To put a blockquote within a list item, the blockquote's `>` delimiters need to be indented:

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

To put a code block within a list item, the code block needs to be indented *twice* -- 8 spaces or two tabs:

    *   A list item with a code block:

            <code goes here>


It's worth noting that it's possible to trigger an ordered list by accident, by writing something like this:

    1986. What a great season.

In other words, a *number-period-space* sequence at the beginning of a line. To avoid this, you can backslash-escape the period:

    1986\. What a great season.



<h3 id="precode">Code Blocks</h3>

Pre-formatted code blocks are used for writing about programming or markup source code. Rather than forming normal paragraphs, the lines of a code block are interpreted literally. Markdown wraps a code block in both `<pre>` and `<code>` tags.

To produce a code block in Markdown, simply indent every line of the block by at least 4 spaces or 1 tab. For example, given this input:

    This is a normal paragraph:

        This is a code block.

Markdown will generate:

    <p>This is a normal paragraph:</p>

    <pre><code>This is a code block.
    </code></pre>

One level of indentation -- 4 spaces or 1 tab -- is removed from each line of the code block. For example, this:

    Here is an example of AppleScript:

        tell application "Foo"
            beep
        end tell

will turn into:

    <p>Here is an example of AppleScript:</p>

    <pre><code>tell application "Foo"
        beep
    end tell
    </code></pre>

A code block continues until it reaches a line that is not indented (or the end of the article).

Within a code block, ampersands (`&`) and angle brackets (`<` and `>`) are automatically converted into HTML entities. This makes it very easy to include example HTML source code using Markdown -- just paste it and indent it, and Markdown will handle the hassle of encoding the ampersands and angle brackets. For example, this:

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

will turn into:

    <pre><code>&lt;div class="footer"&gt;
        &amp;copy; 2004 Foo Corporation
    &lt;/div&gt;
    </code></pre>

Regular Markdown syntax is not processed within code blocks. E.g., asterisks are just literal asterisks within a code block. This means it's also easy to use Markdown to write about Markdown's own syntax.

<p class="alert-message block-message info"><i><b>New with Github-Flavored-Markdown</b></i><br><br>
<b>Fenced Code Blocks</b>
Markdown converts text with four spaces at the front of each line to code blocks. GFM supports that, but we also support fenced blocks. Just wrap your code blocks in ``` and you won't need to indent manually to trigger a code block.
</p>

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Syntax highlighting</b>
We take code blocks a step further and add syntax highlighting if you request it. In your fenced block, add an optional language identifier and we'll run it through syntax highlighting. For example, to syntax highlight Ruby code:
</p>

    ``` ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

will use an online [pygments-powered](http://pygments.appspot.com) syntax-highlighter to generate pretty-formatted html for your sourcecode:

``` ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

#### Syntax-highlighter Languages
The following is a list of the more common languages that are supported. 
<div class="show_more btn success">
    Toggle full language list
</div>

<div class="less_content">
    <table class="condensed-table zebra-striped" >
      <thead><tr><th>Language</th><th style="width:250px;">highlight code</th><th>Language</th><th>highlight code</th></tr></thead>
      <tbody>
        <tr><td>Bash</td><td>bash</td><td>Batchfile</td><td>bat</td></tr>
        <tr><td>C</td><td>c</td><td>C#</td><td>csharp</td></tr>
        <tr><td>C++</td><td>cpp</td><td>CMake</td><td>cmake</td></tr>
        <tr><td>CoffeeScript</td><td>coffee-script</td><td>CSS</td><td>css</td></tr>
        <tr><td>Delphi</td><td>delphi</td><td>Diff</td><td>diff</td></tr>
        <tr><td>HTML</td><td>html</td><td>INI</td><td>ini</td></tr>
        <tr><td>IRC logs</td><td>irc</td><td>Java</td><td>java</td></tr>
        <tr><td>JavaScript</td><td>js</td><td>Lua</td><td>lua</td></tr>
        <tr><td>Makefile</td><td>make</td><td>Makefile (basemake)</td><td>basemake</td></tr>
        <tr><td>MySQL</td><td>mysql</td><td>NASM</td><td>nasm</td></tr>
        <tr><td>Perl</td><td>perl</td><td>PHP</td><td>php</td></tr>
        <tr><td>Python</td><td>python</td><td>Python 3</td><td>python3</td></tr>
        <tr><td>Python 3.0 Traceback</td><td>py3tb</td><td>Python console session</td><td>pycon</td></tr>
        <tr><td>Python Traceback</td><td>pytb</td><td>Raw token data</td><td>raw</td></tr>
        <tr><td>Ruby</td><td>rb</td><td>Ruby irb session</td><td>rbcon</td></tr>
        <tr><td>SQL</td><td>sql</td><td>Text only</td><td>text</td></tr>
        <tr><td>VB.net</td><td>vb.net</td><td>XML</td><td>xml</td></tr>
        <tr><td>XSLT</td><td>xslt</td><td>YAML</td><td>yaml</td></tr>
      </tbody>
    </table>
</div>

<div class="more_content">
    <table class="condensed-table zebra-striped" >
      <thead><tr><th>Language</th><th style="width:250px;">highlight code</th><th>Language</th><th>highlight code</th></tr></thead>
      <tbody>
        <tr><td>ABAP</td><td>abap</td><td>ActionScript</td><td>as</td></tr>
        <tr><td>ActionScript 3</td><td>as3</td><td>Ada</td><td>ada</td></tr>
        <tr><td>ANTLR</td><td>antlr</td><td>ANTLR With ActionScript Target</td><td>antlr-as</td></tr>
        <tr><td>ANTLR With C# Target</td><td>antlr-csharp</td><td>ANTLR With CPP Target</td><td>antlr-cpp</td></tr>
        <tr><td>ANTLR With Java Target</td><td>antlr-java</td><td>ANTLR With ObjectiveC Target</td><td>antlr-objc</td></tr>
        <tr><td>ANTLR With Perl Target</td><td>antlr-perl</td><td>ANTLR With Python Target</td><td>antlr-python</td></tr>
        <tr><td>ANTLR With Ruby Target</td><td>antlr-ruby</td><td>ApacheConf</td><td>apacheconf</td></tr>
        <tr><td>AppleScript</td><td>applescript</td><td>aspx-cs</td><td>aspx-cs</td></tr>
        <tr><td>aspx-vb</td><td>aspx-vb</td><td>Asymptote</td><td>asy</td></tr>
        <tr><td>Bash</td><td>bash</td><td>Bash Session</td><td>console</td></tr>
        <tr><td>Batchfile</td><td>bat</td><td>BBCode</td><td>bbcode</td></tr>
        <tr><td>Befunge</td><td>befunge</td><td>Boo</td><td>boo</td></tr>
        <tr><td>Brainfuck</td><td>brainfuck</td><td>C</td><td>c</td></tr>
        <tr><td>C#</td><td>csharp</td><td>C++</td><td>cpp</td></tr>
        <tr><td>c-objdump</td><td>c-objdump</td><td>cfstatement</td><td>cfs</td></tr>
        <tr><td>Cheetah</td><td>cheetah</td><td>Clojure</td><td>clojure</td></tr>
        <tr><td>CMake</td><td>cmake</td><td>CoffeeScript</td><td>coffee-script</td></tr>
        <tr><td>Coldufsion HTML</td><td>cfm</td><td>Common Lisp</td><td>common-lisp</td></tr>
        <tr><td>cpp-objdump</td><td>cpp-objdump</td><td>CSS</td><td>css</td></tr>
        <tr><td>CSS+Django/Jinja</td><td>css+django</td><td>CSS+Genshi Text</td><td>css+genshitext</td></tr>
        <tr><td>CSS+Mako</td><td>css+mako</td><td>CSS+Myghty</td><td>css+myghty</td></tr>
        <tr><td>CSS+PHP</td><td>css+php</td><td>CSS+Ruby</td><td>css+erb</td></tr>
        <tr><td>CSS+Smarty</td><td>css+smarty</td><td>Cython</td><td>cython</td></tr>
        <tr><td>D</td><td>d</td><td>d-objdump</td><td>d-objdump</td></tr>
        <tr><td>Darcs Patch</td><td>dpatch</td><td>Debian Control file</td><td>control</td></tr>
        <tr><td>Debian Sourcelist</td><td>sourceslist</td><td>Delphi</td><td>delphi</td></tr>
        <tr><td>Diff</td><td>diff</td><td>Django/Jinja</td><td>django</td></tr>
        <tr><td>Dylan</td><td>dylan</td><td>Embedded Ragel</td><td>ragel-em</td></tr>
        <tr><td>ERB</td><td>erb</td><td>Erlang</td><td>erlang</td></tr>
        <tr><td>Erlang erl session</td><td>erl</td><td>Evoque</td><td>evoque</td></tr>
        <tr><td>Felix</td><td>felix</td><td>Fortran</td><td>fortran</td></tr>
        <tr><td>GAS</td><td>gas</td><td>Genshi</td><td>genshi</td></tr>
        <tr><td>Genshi Text</td><td>genshitext</td><td>Gettext Catalog</td><td>pot</td></tr>
        <tr><td>Gherkin</td><td>Cucumber</td><td>GLSL</td><td>glsl</td></tr>
        <tr><td>Gnuplot</td><td>gnuplot</td><td>Go</td><td>go</td></tr>
        <tr><td>Groff</td><td>groff</td><td>Haml</td><td>haml</td></tr>
        <tr><td>Haskell</td><td>haskell</td><td>haXe</td><td>hx</td></tr>
        <tr><td>HTML</td><td>html</td><td>HTML+Cheetah</td><td>html+cheetah</td></tr>
        <tr><td>HTML+Django/Jinja</td><td>html+django</td><td>HTML+Evoque</td><td>html+evoque</td></tr>
        <tr><td>HTML+Genshi</td><td>html+genshi</td><td>HTML+Mako</td><td>html+mako</td></tr>
        <tr><td>HTML+Myghty</td><td>html+myghty</td><td>HTML+PHP</td><td>html+php</td></tr>
        <tr><td>HTML+Smarty</td><td>html+smarty</td><td>INI</td><td>ini</td></tr>
        <tr><td>Io</td><td>io</td><td>IRC logs</td><td>irc</td></tr>
        <tr><td>Java</td><td>java</td><td>Java Server Page</td><td>jsp</td></tr>
        <tr><td>JavaScript</td><td>js</td><td>JavaScript+Cheetah</td><td>js+cheetah</td></tr>
        <tr><td>JavaScript+Django/Jinja</td><td>js+django</td><td>JavaScript+Genshi Text</td><td>js+genshitext</td></tr>
        <tr><td>JavaScript+Mako</td><td>js+mako</td><td>JavaScript+Myghty</td><td>js+myghty</td></tr>
        <tr><td>JavaScript+PHP</td><td>js+php</td><td>JavaScript+Ruby</td><td>js+erb</td></tr>
        <tr><td>JavaScript+Smarty</td><td>js+smarty</td><td>Lighttpd configuration file</td><td>lighty</td></tr>
        <tr><td>Literate Haskell</td><td>lhs</td><td>LLVM</td><td>llvm</td></tr>
        <tr><td>Logtalk</td><td>logtalk</td><td>Lua</td><td>lua</td></tr>
        <tr><td>Makefile</td><td>make</td><td>Makefile (basemake)</td><td>basemake</td></tr>
        <tr><td>Mako</td><td>mako</td><td>Matlab</td><td>matlab</td></tr>
        <tr><td>MiniD</td><td>minid</td><td>Modelica</td><td>modelica</td></tr>
        <tr><td>Modula-2</td><td>modula2</td><td>MoinMoin/Trac Wiki markup</td><td>trac-wiki</td></tr>
        <tr><td>MOOCode</td><td>moocode</td><td>MuPAD</td><td>mupad</td></tr>
        <tr><td>MXML</td><td>mxml</td><td>Myghty</td><td>myghty</td></tr>
        <tr><td>MySQL</td><td>mysql</td><td>NASM</td><td>nasm</td></tr>
        <tr><td>Newspeak</td><td>newspeak</td><td>Nginx configuration file</td><td>nginx</td></tr>
        <tr><td>NumPy</td><td>numpy</td><td>objdump</td><td>objdump</td></tr>
        <tr><td>Objective-C</td><td>objective-c</td><td>Objective-J</td><td>objective-j</td></tr>
        <tr><td>OCaml</td><td>ocaml</td><td>Ooc</td><td>ooc</td></tr>
        <tr><td>Perl</td><td>perl</td><td>PHP</td><td>php</td></tr>
        <tr><td>POVRay</td><td>pov</td><td>Prolog</td><td>prolog</td></tr>
        <tr><td>Python</td><td>python</td><td>Python 3</td><td>python3</td></tr>
        <tr><td>Python 3.0 Traceback</td><td>py3tb</td><td>Python console session</td><td>pycon</td></tr>
        <tr><td>Python Traceback</td><td>pytb</td><td>Raw token data</td><td>raw</td></tr>
        <tr><td>RConsole</td><td>rconsole</td><td>REBOL</td><td>rebol</td></tr>
        <tr><td>Redcode</td><td>redcode</td><td>reStructuredText</td><td>rst</td></tr>
        <tr><td>RHTML</td><td>rhtml</td><td>Ruby</td><td>rb</td></tr>
        <tr><td>Ruby irb session</td><td>rbcon</td><td>S</td><td>splus</td></tr>
        <tr><td>Sass</td><td>sass</td><td>Scala</td><td>scala</td></tr>
        <tr><td>Scheme</td><td>scheme</td><td>Smalltalk</td><td>smalltalk</td></tr>
        <tr><td>Smarty</td><td>smarty</td><td>SQL</td><td>sql</td></tr>
        <tr><td>sqlite3con</td><td>sqlite3</td><td>SquidConf</td><td>squidconf</td></tr>
        <tr><td>Tcl</td><td>tcl</td><td>Tcsh</td><td>tcsh</td></tr>
        <tr><td>TeX</td><td>tex</td><td>Text only</td><td>text</td></tr>
        <tr><td>Vala</td><td>vala</td><td>VB.net</td><td>vb.net</td></tr>
        <tr><td>VimL</td><td>vim</td><td>XML</td><td>xml</td></tr>
        <tr><td>XML+Cheetah</td><td>xml+cheetah</td><td>XML+Django/Jinja</td><td>xml+django</td></tr>
        <tr><td>XML+Evoque</td><td>xml+evoque</td><td>XML+Mako</td><td>xml+mako</td></tr>
        <tr><td>XML+Myghty</td><td>xml+myghty</td><td>XML+PHP</td><td>xml+php</td></tr>
        <tr><td>XML+Ruby</td><td>xml+erb</td><td>XML+Smarty</td><td>xml+smarty</td></tr>
        <tr><td>XSLT</td><td>xslt</td><td>YAML</td><td>yaml</td></tr>
      </tbody>
    </table>
</div>
<br/>

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Smuggling links into syntax-highlighted regions</b><br>
It's possible to do some meta-formatting with the content in the syntax-highlighted blocks if you want to put a link around a peice of text.
<b>Note: </b> This is a big-hack, and it's pretty certain there are conditions where this won't work and will spew hashes around your code.<br>
</p>
Reformat the code you want to have a link in with the following:

    «ORIGINAL-BIT-OF-CODE«LINK»

The `«` character can be typed using ALT-174 on the numpad. 
The `»` character can be typed using ALT-175 on the numpad.

Replace the `ORIGINAL-BIT-OF_CODE` with the code in the block.
Replace the `LINK` with the link target. 

For an example, see [ptk page source](https://raw.github.com/coapp/coapp.org/master/src/dynamic/reference/ptk.html.md)

<br/>
<p class="alert-message block-message info"><i><b>New with Github-Flavored-Markdown</b></i><br><br>
<b>A bit of the GitHub spice</b><br>

In addition to the changes in the previous section, certain references are auto-linked :
<i>note: these work when there is a project context. Probably broken right now.</i>
</p>

    * SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
    * User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
    * User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
    * \#Num: #1
    * User/#Num: mojombo#1
    * User/Project#Num: mojombo/god#1
    
becomes

* SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* \#Num: #1
* User/#Num: mojombo#1
* User/Project#Num: mojombo/god#1

<h3 id="hr">Horizontal Rules</h3>

You can produce a horizontal rule tag (`<hr />`) by placing three or more hyphens, asterisks, or underscores on a line by themselves. If you wish, you may use spaces between the hyphens or asterisks. Each of the following lines will produce a horizontal rule:

    * * *

    ***

    *****

    - - -

    ---------------------------------------


* * *

<h2 id="span">Span Elements</h2>

### [Links](!link)</h3>

Markdown supports two style of links: *inline* and *reference*.

In both styles, the link text is delimited by [square brackets].

To create an inline link, use a set of regular parentheses immediately after the link text's closing square bracket. Inside the parentheses, put the URL where you want the link to point, along with an *optional* title for the link, surrounded in quotes. For example:

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

Will produce:

    <p>This is <a href="http://example.com/" title="Title">
    an example</a> inline link.</p>

    <p><a href="http://example.net/">This link</a> has no
    title attribute.</p>

If you're referring to a local resource on the same server, you can use relative paths:

    See my [About](/about/) page for details.   

Reference-style links use a second set of square brackets, inside which you place a label of your choosing to identify the link:

    This is [an example][id] reference-style link.

You can optionally use a space to separate the sets of brackets:

    This is [an example] [id] reference-style link.

Then, anywhere in the document, you define your link label like this,
on a line by itself:

    [id]: http://example.com/  "Optional Title Here"

That is:

*   Square brackets containing the link identifier (optionally
    indented from the left margin using up to three spaces);
*   followed by a colon;
*   followed by one or more spaces (or tabs);
*   followed by the URL for the link;
*   optionally followed by a title attribute for the link, enclosed
    in double or single quotes, or enclosed in parentheses.

The following three link definitions are equivalent:

	[foo]: http://example.com/  "Optional Title Here"
	[foo]: http://example.com/  'Optional Title Here'
	[foo]: http://example.com/  (Optional Title Here)

**Note:** There is a known bug in Markdown.pl 1.0.1 which prevents single quotes from being used to delimit link titles.

The link URL may, optionally, be surrounded by angle brackets:

    [id]: <http://example.com/>  "Optional Title Here"

You can put the title attribute on the next line and use extra spaces or tabs for padding, which tends to look better with longer URLs:

    [id]: http://example.com/longish/path/to/resource/here
        "Optional Title Here"

Link definitions are only used for creating links during Markdown processing, and are stripped from your document in the HTML output.

Link definition names may consist of letters, numbers, spaces, and punctuation -- but they are *not* case sensitive. E.g. these two links:

	[link text][a]
	[link text][A]

are equivalent.

The *implicit link name* shortcut allows you to omit the name of the link, in which case the link text itself is used as the name. Just use an empty set of square brackets -- e.g., to link the word "Google" to the google.com web site, you could simply write:

	[Google][]

And then define the link:

	[Google]: http://google.com/

Because link names may contain spaces, this shortcut even works formultiple words in the link text:

	Visit [Daring Fireball][] for more information.

And then define the link:
	
	[Daring Fireball]: http://daringfireball.net/

Link definitions can be placed anywhere in your Markdown document. Itend to put them immediately after each paragraph in which they'reused, but if you want, you can put them all at the end of yourdocument, sort of like footnotes.

Here's an example of reference links in action:

    I get 10 times more traffic from [Google] [1] than from
    [Yahoo] [2] or [MSN] [3].

      [1]: http://google.com/        "Google"
      [2]: http://search.yahoo.com/  "Yahoo Search"
      [3]: http://search.msn.com/    "MSN Search"

Using the implicit link name shortcut, you could instead write:

    I get 10 times more traffic from [Google][] than from
    [Yahoo][] or [MSN][].

      [google]: http://google.com/        "Google"
      [yahoo]:  http://search.yahoo.com/  "Yahoo Search"
      [msn]:    http://search.msn.com/    "MSN Search"

Both of the above examples will produce the following HTML output:

    <p>I get 10 times more traffic from <a href="http://google.com/"
    title="Google">Google</a> than from
    <a href="http://search.yahoo.com/" title="Yahoo Search">Yahoo</a>
    or <a href="http://search.msn.com/" title="MSN Search">MSN</a>.</p>

For comparison, here is the same paragraph written usingMarkdown's inline link style:

    I get 10 times more traffic from [Google](http://google.com/ "Google")
    than from [Yahoo](http://search.yahoo.com/ "Yahoo Search") or
    [MSN](http://search.msn.com/ "MSN Search").

The point of reference-style links is not that they're easier towrite. The point is that with reference-style links, your documentsource is vastly more readable. Compare the above examples: usingreference-style links, the paragraph itself is only 81 characterslong; with inline-style links, it's 176 characters; and as raw HTML,it's 234 characters. In the raw HTML, there's more markup than thereis text.

With Markdown's reference-style links, a source document much moreclosely resembles the final output, as rendered in a browser. Byallowing you to move the markup-related metadata out of the paragraph,you can add links without interrupting the narrative flow of yourprose.

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Inter-document References</b></b>
Pages in the site can declare a `docid` in their <a href="/developers/modify-website.html#yaml">YAML Front Matter</a>. The docid can be used as a reference from any other page in the website, making it less likely that pages will break links if moved around.
</p>
For example, this page has the header:

    ---
    layout: 'article'
    title: 'Garrett Flavored Markdown Reference Guide' 
    version: '1.0'
    docid: 'gfm'
    ---

And other documents in this site can reference it by simply:

    Check out the [garrett-flavored-markdown][gfm] page.

which renders as:

Check out the [garrett-flavored-markdown][gfm] page.

**Referece Anchors** 
If you want to declare an anchor on a page (so that you can have a link jump to it with `#anchorname`) you can create one with the following syntax:

    [anchor text] (!anchorname)

which registers an sitewide reference as `docid#anchorname` which means you can even use anchors within the page to jump to a particular location in another document:

    Check out this [links section][gfm#link] .

which renders as:

Check out this [links section][gfm#link] .

<h3 id="em">Emphasis</h3>

Markdown treats asterisks (`*`) and underscores (`_`) as indicators ofemphasis. Text wrapped with one `*` or `_` will be wrapped with anHTML `<em>` tag; double `*`'s or `_`'s will be wrapped with an HTML`<strong>` tag. E.g., this input:

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

will produce:

    <em>single asterisks</em>

    <em>single underscores</em>

    <strong>double asterisks</strong>

    <strong>double underscores</strong>

You can use whichever style you prefer; the lone restriction is that the same character must be used to open and close an emphasis span.

Emphasis can be used in the middle of a word:

    un*frigging*believable

But if you surround an `*` or `_` with spaces, it'll be treated as a literal asterisk or underscore.

To produce a literal asterisk or underscore at a position where it would otherwise be used as an emphasis delimiter, you can backslash escape it:

    \*this text is surrounded by literal asterisks\*

<p class="alert-message block-message info"><i><b>New with Github-Flavored-Markdown</b></i><br><br>
<b>Multiple underscores in words</b><br>

It is not reasonable to italicize just part of a word, especially when you're dealing with code and names often appear with multiple underscores. Therefore, GFM ignores multiple underscores in words.
</p>

    perform_complicated_task
    do_this_and_do_that_and_another_thing
becomes

perform_complicated_task
do_this_and_do_that_and_another_thing

<h3 id="code">Code</h3>

To indicate a span of code, wrap it with backtick quotes (`` ` ``).Unlike a pre-formatted code block, a code span indicates code within anormal paragraph. For example:

    Use the `printf()` function.

will produce:

    <p>Use the <code>printf()</code> function.</p>

To include a literal backtick character within a code span, you can usemultiple backticks as the opening and closing delimiters:

    ``There is a literal backtick (`) here.``

which will produce this:

    <p><code>There is a literal backtick (`) here.</code></p>

The backtick delimiters surrounding a code span may include spaces --one after the opening, one before the closing. This allows you to placeliteral backtick characters at the beginning or end of a code span:

	A single backtick in a code span: `` ` ``
	
	A backtick-delimited string in a code span: `` `foo` ``

will produce:

	<p>A single backtick in a code span: <code>`</code></p>
	
	<p>A backtick-delimited string in a code span: <code>`foo`</code></p>

With a code span, ampersands and angle brackets are encoded as HTMLentities automatically, which makes it easy to include example HTMLtags. Markdown will turn this:

    Please don't use any `<blink>` tags.

into:

    <p>Please don't use any <code>&lt;blink&gt;</code> tags.</p>

You can write this:

    `&#8212;` is the decimal-encoded equivalent of `&mdash;`.

to produce:

    <p><code>&amp;#8212;</code> is the decimal-encoded
    equivalent of <code>&amp;mdash;</code>.</p>



<h3 id="img">Images</h3>

Admittedly, it's fairly difficult to devise a "natural" syntax forplacing images into a plain text document format.

Markdown uses an image syntax that is intended to resemble the syntaxfor links, allowing for two styles: *inline* and *reference*.

Inline image syntax looks like this:

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

That is:

*   An exclamation mark: `!`;
*   followed by a set of square brackets, containing the `alt`
    attribute text for the image;
*   followed by a set of parentheses, containing the URL or path to
    the image, and an optional `title` attribute enclosed in double
    or single quotes.

Reference-style image syntax looks like this:

    ![Alt text][id]

Where "id" is the name of a defined image reference. Image referencesare defined using syntax identical to link references:

    [id]: url/to/image  "Optional title attribute"

As of this writing, Markdown has no syntax for specifying thedimensions of an image; if this is important to you, you can simplyuse regular HTML `<img>` tags.

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Image location references</b></b>
You can just give the filename to the image itself in an image reference. DocPad will find the image in the static content and generate the full path for you.
</p>

    ![Alt text][foo.jpg] 
    
Will find an image named `foo.jpg` somewhere in the `/static/` folder tree and place the full path to the image in the link for you.

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Scrollable Image Wrapper</b></b>
GFM also has the ability to wrap an image in an overflow-sensitive wrapper so that it won't wreck your layout.    
</p>

Substitute an at-symbol `@` for the exclamation `!` in the image syntax:

    @ [Alt text](imageurl)

And you will get a nicely contained image rendering. 

<p class="alert-message block-message success"><i><b>New with Garrett-Flavored-Markdown</b></i><br><br>
<b>Really Smart Video Embedding</b></b>
GFM has made embedding videos into the pages trivial, wrapping up the functionality from <a href="http://mediaelementjs.com/">MediaElement.js</a> so that videos can be posted supporting all browsers (including phones) by only encoding two formats (h.264 and webm) and the video will render as HTML5 video links, or fall back to Flash or Silverlight for embedding.
</p>
The format for embedding videos is:

    % [width,height,posterimageurl,mp4url,webmurl]
    
Where:

`width` - the desired width of the video (actually, not used anymore, the video container scales to the size of it's parent layout)
`height` - the desired height of the video (actually, not used anymore, the video container scales to the size of it's parent layout)
`posterimageurl` - the image url for the poster (when it's not playing) -- this can just be the filename, and will look up in the `/static/` folder automatically.
`mp4url` - the full url to the mp4 video **WARNING** do not put the video file in github, we need to upload them to our Azure CDN to make sure that bandwith and size are managed correctly (contact Garrett :).
`webmurl` - the full url to the webm video **WARNING** do not put the video file in github, we need to upload them to our Azure CDN to make sure that bandwith and size are managed correctly (contact Garrett :).

For information on transcoding video files to .mp4 and .webm, check out [this tutorial][developer:encoding-video]

* * *


<h2 id="misc">Miscellaneous</h2>

<h3 id="autolink">Automatic Links</h3>

Markdown supports a shortcut style for creating "automatic" links for URLs and email addresses: simply surround the URL or email address with angle brackets. What this means is that if you want to show the actual text of a URL or email address, and also have it be a clickable link, you can do this:

    <http://example.com/>
    
Markdown will turn this into:

    <a href="http://example.com/">http://example.com/</a>

Automatic links for email addresses work similarly, except thatMarkdown will also perform a bit of randomized decimal and hexentity-encoding to help obscure your address from address-harvestingspambots. For example, Markdown will turn this:

    <address@example.com>

into something like this:

    <a href="&#x6D;&#x61;i&#x6C;&#x74;&#x6F;:&#x61;&#x64;&#x64;&#x72;&#x65;
    &#115;&#115;&#64;&#101;&#120;&#x61;&#109;&#x70;&#x6C;e&#x2E;&#99;&#111;
    &#109;">&#x61;&#x64;&#x64;&#x72;&#x65;&#115;&#115;&#64;&#101;&#120;&#x61;
    &#109;&#x70;&#x6C;e&#x2E;&#99;&#111;&#109;</a>

which will render in a browser as a clickable link to "address@example.com".

(This sort of entity-encoding trick will indeed fool many, if notmost, address-harvesting bots, but it definitely won't fool all ofthem. It's better than nothing, but an address published in this waywill probably eventually start receiving spam.)

<p class="alert-message block-message info"><i><b>New with Github-Flavored-Markdown</b></i><br><br>
<b>URL autolinking</b></br>

GFM will autolink standard URLs, so if you want to link to a URL (instead of setting link text), you can simply enter the URL and it will be turned into a link to that URL.
</p>

<h3 id="backslash">Backslash Escapes</h3>

Markdown allows you to use backslash escapes to generate literalcharacters which would otherwise have special meaning in Markdown'sformatting syntax. For example, if you wanted to surround a wordwith literal asterisks (instead of an HTML `<em>` tag), you can usebackslashes before the asterisks, like this:

    \*literal asterisks\*

Markdown provides backslash escapes for the following characters:

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
	+	plus sign
	-	minus sign (hyphen)
    .   dot
    !   exclamation mark

