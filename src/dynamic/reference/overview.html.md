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

**Property sheets** is a domain-specific language (DSL) that CoApp created for the writing of AutoPackage and BuildPackage scripts.  It is similar to Cascading Style Sheets, but the semantics are customized to meet the specific needs of package creation.

#### Overview

Property sheets contain two basic elements:

* Node - a container for nodes and/or properties
* Property - a property name and an assigned property value

White space has no meaning in the property sheets language, so use whitespace in a manner consistent with your programming norms.

The operator '//' designates a comment that extends to the end of the line

#### Nodes

As a general rule nodes are defined as follows:

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
		
There is a "special case" node designated by * or the name "condition."  This special case node always takes parameters so the square brackets are required.  However, for this particular node, neither the * nor the node name are required.  Each of the following three designations is equivalent:

	condition[parameter_1, parameter_2] {}
	*[parameter_1, parameter_2]{}
	[paremeter_1, parameter_2]{}

#### Properties
	
Properties have a name and a value.  Values can be one of two types, a string or a collection.  The '=' operator assigns string values and the ':' operator assigns collection values.  You can define properties and assign them values in the following manner:

	property_name_1 = some string value
	property_name_2: {value_1, value_2, value_3}
	
Note that when a string value is assigned quotation marks are not required.  The one exception to this rule is when the string contains a semicolon, in which case the value must be preceded and followed by quotation marks as follows:

	property_name_1 = "some string value that has a ; in it"
	
A collection can be delimited by either commas or semicolons, so the following is also a proper assignment for a collection:

	property_name_2: {value_1; value_2; value3}
	
A collection can consist of one element.  In such cases the {} the contain the collection list are not required:

	property_name_2: value_1
	
A string value can be coerced as a collection, so the following property, which has a string value assigned to it, can later be used as a collective property:

	property_name_1 = value_1, value_2
	
The collective assign also recognizes the additive operator +=.  So you can add a value to the collection of a property by making the assignment:

	property_name_2 += value_n
	
If the original value for property_name_2 was {value_1, value_2, value_3} then the resulting value for property becomes:

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
	
In the next example the parameter lists [Win32,v110,dynamic] and [x64,v110,dynamic] represent pivot points.  In the first condition the package is being created for the Win32 (x86) platform for Visual Studio 2012 and as a dynamic link library.  In the second condition the platform is changed to x64.  Visual Studio 2012 and the dynamic link format remain unchanged.  Notice how the "condition" node is expressed with only square brackets []. 

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