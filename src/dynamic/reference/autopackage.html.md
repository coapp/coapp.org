---
layout: 'article'
title: 'Autopackage' 
version: '1.0'
docid: 'reference:autopackage'
---
## Purpose

**Autopackage** creates CoApp packages while trying to keep the publisher from understanding all the fine-details of the internals of the packages themselves.

#### Command Line Help
**Autopackage** uses CoApp's [common command line conventions][reference:cli] as the basis for command line options.

``` text
Outercurve Foundation Autopackage  Version 1.1.2.1285 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp Autopackage utility
-------------------------------------------------------------------------------
Usage:
-------

Autopackage [options] <file.autopkg ...>

    «<file.autopkg>«#autopkg» - one or more property sheet files for composing a package

    Options:
    --------
    «--help«/reference/cli.html#help»                      this help 
    «--nologo«/reference/cli.html#nologo»                    don't display the logo
    «--load-config=<file>«/reference/cli.html#loadconfig»        loads configuration from <file>
    «--verbose«/reference/cli.html#verbose»                   prints verbose messages

    «--certificate-path=<c.pfx>«#certificatepath»  path to load signing certificate (w/pvt key)
    «--password=<pwd>«#password»            password for certificate file
    «--remember«#remember»                  store certificate details in registry (encrypted)
```

### Certificate Options
All CoApp packages are required to be digitally signed with a certificate.

#### Option [certificate-path](!certificatepath) 

#### Option [password](!password) 

#### Option [remember](!remember) 

## [Autopackage File Format (.autopkg)](!autopkg)
**Autopackage** uses CoApp's [common property sheet][reference:propertysheet] as the basis for the `.autopkg` format.


