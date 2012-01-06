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
The `package` rule contains the manditory data for creating a package.

``` c#
package { 
    «name«#package.name» : «string«#string»; 
    «version«#package.version» : «/*(kt):(four-digit-version)*/«#fourdigitversion»;
    «arch«#package.arch» : «/*(kt):(architecture)*/«#architecture»;
    «locations«#package.locations»: { 
        «/*(kt):(url)*/«#url» ...
    };
    «feeds«#package.feeds» : { 
        «/*(kt):(url)*/«#url» ...
    };
    «publisher«#package.publisher» : «/*(kt):(identity-reference)*/«#identityreference»;
    «display-name«#package.displayname»: «string«#string»;
};
```

**Package Property Descriptions**

|Property Name|Property Description|
|[name](!package.name)|The full name of the package, without any version, platform or public key information. (ie, `"acme.widgets"`) |
|[version](!package.version)|the [four-digit-version](#fourdigitversion) of the package. (ie, `1.2.3.4`) |
|[arch](!package.arch)|the binary [architecture](#architecture) of the contents of the package. It is not permitted to have multiple binary architectures in the same package. |
|[locations](!package.locations)<br/> or *location*|One or more [URL](#url)s that will return the package file. The URL must not be a referencing webpage, as this is the URL that the package manager will attempt to fetch the package from directly. |
|[feed](!package.feeds)<br/> or *feed*|One or more [URL](#url)s of feed locations that may be consulted when looking for a package upgrade.|
|[publisher](!package.publisher)|an [identity-reference](#identityreference) that contains the name, email and web address of the person or organization that created this package. This is not necessarily the author, of which should be listed in the [metadata/contributors](#metadata.contributors) property. |
|[display-name](!package.displayname)|A cosmetic name for the product being packaged (ie, `"Acme Widgets"` instead of the `"acme.widgets"` [name](#package.name) property) |

#### metadata

The `metadata` rule contains additional cosmetic data about the contents of the package.

``` c#
metadata { 
    «description«#metadata.description» : «string«#string»; 
    «summary«#metadata.summary» : «string«#string»; 
    «icon«#metadata.icon» : «/*(kt):(file-path)*/«#filepath»
    «licenses«#metadata.licenses»: { 
        «/*(kt):(license-reference)*/«#licensereference»...
    };
    «author-version«#metadata.authorversion» : «string«#string»; 
    «bug-tracker«#metadata.bugtracker» : «/*(kt):(url)*/«#url»;
    «publish-date«#metadata.publishdate» : «/*(kt):(date)*/«#date»;
    «nsfw«#metadata.nsfw»: «/*(kt):(boolean)*/«#boolean»;
    «stability«#metadata.stability»: «/*(kt):(stability)*/«#stability»;
    «tags«#metadata.tags» : { 
        «string«#string»...
    };
    «contributors«#metadata.contributors»: { 
        «/*(kt):(identity-reference)*/«#identityreference»...
    };
};
```
**Metadata Property Descriptions**

|Property Name|Property Description|
|[description](!metadata.description)|A full-text description of the software package. Limited HTML may be rendered by the client.|
|[summary](!metadata.summary)|A short description of the package.|
|[icon](!metadata.icon)|The [path](#filepath) to an image that can be used as an icon for the package. Must be limited to 256x256. PNG images will preserve alpha channels|
|[licenses](!metadata.licenses)|One or more [license-references](#licensereference) that specify the license for the package.|
|[author-version](!metadata.authorversion)|a cosmetic string that contains the version the author has assigned to the product. (ie, this can be `"1.0f"` instead of in the [four-digit-version](#fourdigitversion) `"1.0.9.0"` |
|[bug-tracker](!metadata.bugtracker)|A URL pointing to the location of a given product's Bug Tracker.|
|[publish-date](!metadata.publishdate)|The [date](#date) this package is published. Defaults to the current date/time.|
|[nsfw](!metadata.nsfw)|a [boolean](#boolean) flag that the publisher can set to indicate that the package is "not safe for work". NSFW packages that don't set this will incur my wrath.|
|[stability](!metadata.stability)|an integer value ranging from -100 (very unstable) to 100 (very stable) to indicate to consumers the relative stability of the contents of the package. |
|[tags](!metadata.tags)|one or more strings containing arbitrary 'tags' about the product (ie, `tools` ) |
|[contributors](!metadata.contributors)|one or more [identity-reference](identityreference»)s specifying the contact information of the people who contributed to the package. It is common courtesy to list the original authors of a given open source package.|


#### provides
<p class="alert-message warning"><span class="label success">CoApp 1.0-RC</span> While you can specify this rule, currently it has no effect.<br/></p>

The `provides` rule specifies what features the package provides.

``` c#
provides { 
    «feature«#provides.feature»: «/*(kt):(feature-name)*/«#featurename» = «/*(kt):(feature-version)*/«#featureversion»;
};
```
**Provides Property Descriptions**

|Property Name|Property Description|
|[feature](!provides.feature)| the feature property allows the packager to express any number of feature/versions that the given package satisfies |

> TODO: We need to build a feature string registry. 

#### requires
<p class="alert-message warning"><span class="label success">CoApp 1.0-RC</span> Currently, dependencies only match on packages, feature matching is not yet available.<br/></p>

The `requires` rule allows the publisher to specify what packages are necessary to install this package.

``` c#
requires  {
    «package«#requires.package»: «/*(kt):(canonical-package-name)*/«#packagename»;

    // exact matches are done in RC 
    «package: exact«#requires.package.exact» = «/*(kt):(canonical-package-name)*/«#packagename»;

    // features are targeted for RC
    «feature«#requires.feature»: {
        «/*(kt):(feature-name)*/«#featurename» = «/*(kt):(feature-version-modifier)*/«#featureversion»...
    };
}
```

**Requires Property Descriptions**

|Property Name|Property Description|
|[package](!requires.package)|Given a canonical package name, this specifies an explicit dependency on another package. The package-manager may associate the latest binary-compatable version instead of the specified version|
|[package](!requires.package.exact)|<span class="label success">CoApp 1.0-RC</span> Given a canonical package name, this specifies an explicit dependency on another package, matching the version exactly. |
|[feature](!requires.feature)|<span class="label success">CoApp 1.0-RC</span> specifies a dependency on given *feature*, with an optional version, or version-plus-modifier.|

#### compatability-policy
The `compatability-policy` rule defines the previous versions of this software which this version replaces. This asserts that this version is binary compatable with all replaced versions.

``` c#
compatability-policy { 
    «minimum«#compatability-policy.minimum»: «/*(kt):(four-digit-version)*/«#fourdigitversion»;
    «maximum«#compatability-policy.maximum»: «/*(kt):(four-digit-version)*/«#fourdigitversion»;
    «versions«#compatability-policy.versions» : {
        «/*(kt):(two-digit-version)*/«#twodigitversion» ...
    }; // if not specified, find the versions by looking at the feeds and finding all the major/minor versions in range.
};
```
**Compatability Property Descriptions**

|Property Name|Property Description|
|[minimum](!compatability-policy.minimum)|The lowest [four-digit-version](#fourdigitversion) for which this package is a binary-compatable replacement.|
|[maximum](!compatability-policy.maximum)|The highest [four-digit-version](#fourdigitversion) for which this package is a binary-compatable replacement.|
|[versions](!compatability-policy.versions)|a collection of [two-digit-version](#twodigitversion)s between the minimum and maximum versions that have been published|

#### files

The `files` rule allows the publisher to specify groups of files that can be used in other properties.

``` c#
files[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    root: «/*(kt):(folder-path)*/«#folderpath»;;
    
    include: { 
       «/*(kt):(file-mask)*/«#filemask»...
    };
    
    trim-path: «/*(kt):(trim-path)*/«#trimpath»;
    
    destination: «/*(kt):(folder-path)*/«#folderpath»;
};
```

#### package-composition

``` c#
package-composition[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {

    file-rewrite: { 
        // <list of files that get 'rewites' (ie, macro resolution)>
        config-files => "rw_${each.Name}"
        // config-files => "${each.NameWithoutExtension}";
        config-files => "${appdir}\config\${each.NameWithoutExtension}";
    };
    
    file-copy: {  // without the macro-handling
        config-files => "${appdir}\config\${each.Name}";
    };
    
    symlinks : {
        exes => @"${global-bin}\${each.name}" = @"${appdir}\${each.name}";
        scripts => @"${global-bin}\${each.name}" = @"${appdir}\${each.name}";
    }    

    symlinks : {
        powershellscripts => @"${global-powershell}\${each.name}" = @"${appdir}\${each.name}";
    }    
   
    environment-variables: {
        "RUBYPATH" = "${appdir}";
    };
    
    registry: { 
        @"${ROOTKEY}#InstallLocation" = "${APPDIR}";
    };
}
```

#### signing

``` c#
signing {
    replace-signature: «/*(kt):(boolean)*/«#boolean»; 
    include: { 
        «/*(kt):(files-reference)*/«#filesreference»... 
    };    
}
```

#### identity

``` c#
identity[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    name : «string«#string»;
    email: «/*(kt):(email-address)*/«#email»;
    website: «/*(kt):(url)*/«#url»;
}
```

#### license

``` c#
license[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    license: «/*(kt):(file-path)*/«#filepath»;
    license-url: «/*(kt):(url)*/«#url»;
    license-type: «string«#string»;
}
```

#### #define
``` c#
#define {
    «string«#string» : «string«#string»;
}
```

### Package Role Rules
#### application

``` c#

application[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    include: {
         «/*(kt):(files-reference)*/«#filesreference
    }
}

```

#### assemblies / assembly

``` c# 
// easy way to do assemblies, instead of listing them one-off 
// this creates individual assembly entries, one for each file.
assemblies {
    include: {
        «/*(kt):(files-reference)*/«#filesreference
    };
}

assembly[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    include: { 
        «/*(kt):(files-reference)*/«#filesreference
    };
    //if this is an "any" package, don't allow more than one thing here
}

```

#### developer-library
``` c# 
developer-library[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    // specifies headers, libs, docs, "include"
}
```

#### service
``` c# 
service[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    // like apps, with options to register/start/stop
}
```

#### web-application 
``` c# 
web-application {
    // register into a webserver, with a handlers, etc
}
```

#### source-code 
``` c# 
source-code[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    // specifies the source files 
}
```

#### driver 
``` c# 
driver[«/*(kt):(reference-declaration)*/«#referencedeclaration»] {
    // yada-yada
}
```

### Rule/Property types

#### Primitive Types

##### [string](!string) type
##### [date](!date) type
##### [boolean](!boolean) type
##### [stability-value](!stability) type
##### [url](!url) type
##### [email-address](!email) type
##### [canonical-package-name](!packagename) type

#### Version Types

##### [two-digit-version](!twodigitversion) class
##### [four-digit-version](!fourdigitversion) class

#### Enumeration Types

##### [architecture](!architecture) enumeration
##### [trim-path](!trimpath) enumeration

#### File/Folder Types

##### [file-mask](!filemask) class
##### [file-path](!filepath) class
##### [folder-path](!folderpath) class

#### Reference Types
##### [files-reference](!filesreference) class
##### [license-reference](!licensereference) class
##### [identity-reference](!identityreference) class

##### [reference-declaration](!referencedeclaration) class

#### Feature Types
##### [featurename](!featurename) class
##### [featureversion](!featureversion) class


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
