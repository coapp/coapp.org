---
layout: 'article'
title: 'Common command line features' 
version: '1.2'
---

CoApp tools generally provide consistent options and patterns between the different tools.


#### Command Line Help

``` text
Outercurve Foundation sometool Version 1.2.3.4 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp sometool for something
-------------------------------------------------------------------------------

Usage:
-------

sometool [options] ...

    Options:
    --------
    «--help«#help»                      this help 
    «--nologo«#nologo»                    don't display the logo
    «--load-config=<file>«#loadconfig»        loads configuration from <file>
    «--verbose«#verbose»                   prints verbose messages

    Hidden Options:
    ----------------
    «--list-bugtrackers«#listbugtrackers»           shows the bugtrackers for the components
                                that are part of this application
            
    «--open-bugtracker«#openbugtracker»           opens the default bugtracker for this app
                                in the default browser
    

```

### General Rules
Options in CoApp tools are specified by the double dash prefix `--`.

Option names are always case-insensitive. 

If an option is valid only once, then the last specified item is the relavent one. 

> For example: in the command `sometool --name=garrett --name=sally` , if the application is expecting only a single name, `sally` would be the accepted value.

If an option is intended to be a boolean value, simply specifying the option defaults the value to `true`. 

> For example: the command `sometool --verbose`  is the same as `sometool --verbose=true`




### Option [help](!help) 

CoApp command line tools display help information (similar to the section above) and often have examples included at the bottom of the help listing.
Specifying `--help` will cause the tool to print the help and then exit.

### Option [nologo](!nologo) 
CoApp command line tools display a logo detailing the version and platform they are running on, along with the Copyright information.

Example:

``` text
Outercurve Foundation sometool Version 1.2.3.4 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp sometool for something
-------------------------------------------------------------------------------
```


### Option [load-config](!loadconfig) 
CoApp command line tools can accept any of their command line arguments in a *response file*.

The response file is a text file that:
- has each command line option on a single line, but without the leading --
- comments are preceded by a hash symbol `#` or a semicolon `;`
- quotes are not needed to encapsulate arguments with spaces


On the command line:

`    --some-option=foo`

would become the following inside the configuration file: 

`    some-option=foo`

Additionally, options in the configuration file can be grouped together in categories. The category is simply syntatic sugar for simplifying the command line.

Categories are declared with the square brackets: `[]`

The category is appended to options that follow its declaration.

A configuration file expressed as:

``` text
source-option=foo
source-option=bar
source-option=bin
source-add=baz
source-ignore=bug
```

can also be expressed as:

``` text
[source]
option=foo
option=bar
option=bin
add=baz
ignore=bug
```

### Option [verbose](!verbose) 

Some CoApp tools will provide additional output based when `--verbose` is specified. Usually this is to provide debugging information to the user.

<hr>

### Option [list-bugtrackers](!listbugtrackers)

Lists the bug trackers registered in the assembly DLLs below the logo:

@[List Bugtracker example](/images/tutorials/cli-1.png)

### Option [open-bugtracker](!openbugtracker)