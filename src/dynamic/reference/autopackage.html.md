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

### Standard Rules

#### package
The package rule contains the manditory data for creating a package.

``` css
package { 
    name : "";
    version : "";
    arch : "";
    locations: { };
    feeds : { };
    publisher : "";
    display-name: "";
};
```

#### metadata
#### provides
#### requires
#### compatability-policy
#### files
#### package-composition
#### signing
#### identity
#### license
#### #define

### Package Role Rules
#### application
#### assemblies / assembly
#### developer-library
#### service
#### web-application 
#### source-code 
#### driver 

### Macro Variables

Resolved at package build time:

|Macro Variable|Description|
|`${OneLessThanCurrent}`|   Current version - 1 (used to get the maximum policy version)|
|`${OutputFilename}`|Filename of the MSI being created (foo-1.2.3.4-x86.msi)|
|`${Package.Name}`|application name (foo)|
|`${Package.Version}`||
|`${Package.Architecture}`||
|`${Package.Vendor}`||
|`${Package.PublicKeyToken}`||
|`${Package.BindingPolicyMinVersion}`||
|`${Package.BindingPolicyMaxVersion}`||
|`${Package.ProductCode}`|// is a GUID ... |
|`${Package.PackageDetails.AuthorVersion}`||
|`${Package.PackageDetails.BugTracker}`||
|`${Package.PackageDetails.Icon}`||
|`${Package.PackageDetails.IsNsfw}`||
|`${Package.PackageDetails.Stability}`||
|`${Package.PackageDetails.SummaryDescription}`||
|`${Package.PackageDetails.PublishDate}`||

Resolved at install time:

|Macro Variable|Description|
|`${apps}`|coapp root directory (typically c:\apps)|
|`${installed}`|`${apps}\.installed`|
|`${cache}`|`${apps}\.cache`|
|`${assemblies}`|`${apps}\assemblies`|
|`${x86}`|`${apps}\x86`|
|`${x64}`|`${apps}\x64`|
|`${bin}`|`${apps}\bin`|
|`${powershell}`|`${apps}\powershell`|
|`${lib}`|`${apps}\lib`|
|`${include}`|`${apps}\include`|
|`${etc}`|`${apps}\etc`|
|`${allprograms}`|The Windows "All Programs" path.|
|`${publishername}`|publisher name (the 'O' from the signing certificate)|
|`${productname}`|product name |
|`${version}`|product version|
|`${arch}`|the architecture of the package|
|`${cosmeticname}`|the cosmetic name of the package (foo-1.2.3.4-x86)|
|`${publishedpackagedir}`|`${apps}\${productname}`|
|`${packagedir}`|`${installed}\${publishername}\${productname}-${version}-${arch}\`|

### Advanced Rules
These rules are not likely to be of use to the publisher; they affect *how* Autopackage creates the MSI files.

#### templates
