---
layout: 'article'
title: 'Property Sheets' 
version: '0.1'
---
<div class="alert-message warning">
    <p>This is a draft document -- send feedback to hanrahat@microsoft.com</p>
</div>
## Property Sheets - The CoApp Domain Specific Language

#### Purpose

**Property sheets (PS)** is a domain-specific language (DSL) that CoApp has created for writing AutoPackage and BuildPackage scripts.  It is similar to [Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets), but the semantics are customized to meet the specific needs of package creation.

#### Overview

Property sheets contain two basic elements:

* Node - a container for nodes and/or properties
* Property - a property name and an assigned property value

White space has no meaning in the property sheets language, so use whitespace in a manner consistent with your programming norms.

The operator '//' designates a comment that extends to the end of the line

#### Nodes

In general, nodes are used to specify the many options you have available as you build components and create packages to deploy them.  As a general rule nodes are defined as follows:

	node_name{
		new_node_name{
			... new_node properties ...
		}
		... node properties ...
	}
	
The order in which nodes and properties are defined within a node container is immaterial.  They can be in any order although the properties defined within an embedded node must remain within the definition of that node (i.e., within the {} for that node).

Nodes can have parameters, which are designated by square brackets [].  The square brackets are not required when the node has no parameters:

	node_name{
		new_node_name[parameter_1, parameter_2]{
			...new_node properties...
		}
		... node properties ...
	}
		
There is a "special case" node designated by "*" or the name "condition."  This special case node always takes parameters so the square brackets are required.  However, for this particular node, neither the * nor the node name are required.  Each of the following three designations is equivalent:

	condition[parameter_1, parameter_2] {}
	*[parameter_1, parameter_2]{}
	[paremeter_1, parameter_2]{}

#### Properties
	
Properties have a name and a value.  Values can be one of two types, a string or a collection.  The '=' operator assigns string values and the ':' operator assigns collection values.  You can define properties and assign them values in the following manner:

	property_name_1 = some string value
	property_name_2: {value_1, value_2, value_3}
	
Note that when a string value is assigned, quotation marks are not required.  The one exception to this rule is when the string contains a semicolon, in which case the value must be preceded and followed by quotation marks as follows:

	property_name_1 = "some string value that has a ; in it"
	
A collection can be delimited by either commas or semicolons, so the following is also a proper assignment for a collection:

	property_name_2: {value_1; value_2; value3}
	
A collection can consist of one element.  In such cases the {} that contain the collection list are not required:

	property_name_2: value_1
	
A string value can be coerced as a collection, so the following property, which has a string value assigned to it, can later be used as a collective property:

	property_name_1 = value_1, value_2
	
The collective assign also recognizes the additive operator +=.  So you can add a value to the collection of a property by making the assignment:

	property_name_2 += value_n
	
If the original value for property_name_2 was {value_1, value_2, value_3} then the resulting value for the property becomes:

	{value_1, value2, value_3, value_n}
	

	
#### Examples

Following are some short examples.

In this first example, a node name "configurations" is defined.  It contains a single node named "Linkage."  The embedded node "Linkgage" contrains a single property "choices."  The property "choices" as been assigned the collection whose values consist of "dynamic," "stdcall" and "static."

	configurations {
		Linkage {
			// the first choice is the default
			// so, unless a choice is made, it will assume the first choice
			choices: { dynamic, stdcall, static };
		}
	}
	
The next example is extracted from an AutoPackage script used to build zlib packages.  As its name implies, AutoPackage is the CoApp tool that drives the automated package creation process.  AutoPackage lets you create multiple variantions of the same package based on different build options.  You may have a dozen or more variants of the same package based on a variety of build criteria including the version of the C or C++ compiler you use, the platform architecture you target, the format of the library you're creating, as well as other build options.  The sample code below shows a portion of "files" node definitions that the script requires to build two variations of the zlib package.

The first variation is specified by the parameter list [Win32,v110,dynamic]. This parameter list instucts AutoPackage to create a zlib package for the Win32 (x86) platform, using Visual C 2012, and that the contents of the package be created as a dynamic link library.  The second variation build is guided by the parameter list[x64,v110,dynamic].  In this case, the target platform is changed to x64.  Visual C 2012 and the dynamic link format remain unchanged.  Notice that both [Win32,v110,dynamic] and [x64,v110,dynamic] are "condition" nodes expressed with only square brackets []. 

    // the files that go into the content folders
    files {
        include: { ..\zlib.h, ..\zconf.h };

        docs: {  ..\doc\**\* };

        [Win32,v110,dynamic] { 
            lib: { ..\output\vc11\x86\release\lib\zlib1.lib };
            bin: { ..\output\vc11\x86\release\bin\zlib1.dll };
        }

        [x64,v110,dynamic] {
            lib: { ..\output\vc11\x64\release\lib\zlib1.lib };
            bin: { ..\output\vc11\x64\release\bin\zlib1.dll };
        }
	}




<!----------------------------------------------------------------------------------
#### Command Line Help

``` text
Outercurve Foundation XXXX Version 1.1.1.1 for x64
Copyright (c) Garrett Serack, CoApp Contributors 2010-2011. All rights reserved
CoApp xxxxx
-------------------------------------------------------------------------------

Usage:
-------

xxxx [options] 

    Options:
    --------
    «--help«/reference/cli.html#help»                      this help 
    «--nologo«/reference/cli.html#nologo»                    don't display the logo
    «--load-config=<file>«/reference/cli.html#loadconfig»        loads configuration from <file>
    «--verbose«/reference/cli.html#verbose»                   prints verbose messages

```

### Option [foo](!foo) 
----------------------------------------------------------------------------------------->