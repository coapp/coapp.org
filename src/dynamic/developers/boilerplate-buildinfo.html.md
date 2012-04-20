---
layout: 'article'
title: '.buildinfo Boilerplate File'
version: 1.0
---

``` c#
///////////////////////////////////////////////////////////////////////////
//
//  Boilerplate:  .buildinfo file
//
//  Please copy and edit this file as appropriate for your package.
//
///////////////////////////////////////////////////////////////////////////

/////////////////////////
//
//  «Imports«/developers/example-imports.html»
//
//  These work very much like C-style #include references, where the contents of
//   imported files are effectively copied into this one when processing.
//  Standard imports are:
//   - version.inc -- Contains only a define of the package version.
//
@import "«version.inc«/developers/example-imports.html»";

/////////////////////////
//
//  Defines
//
//  This section initializes custom variables to be used elsewhere in the
//   document.  Please note that this is NOT the same as assigning a variable
//   from a 'set' section inside of a rule.  Unlike 'set' variables, '#define'
//   variables are case-sensitive.
//  Variables may be set to specific values or to conditionally resolved
//   statements.
//  As a general rule, inner variables to be resolved should be lowercase if 
//   expected to be input from the command line.
//
//  ** NEVER DEFINE A VARIABLE BY SELF REFERENCE! **
//  ** DOING SO WILL CAUSE AUTOPACKAGE TO LOOP FOREVER TRYING TO RESOLVE IT **
//
//  This is ok:   #define {MyVar: "${var??OptionA}";}
//  This is BAD:  #define {other: "${other??We'll never get here...}";}
//
#define {
    // This variable is a string which can be used either directly or can be
    //  autoconverted into a collection on demand.
    myString: "1, 2, 3";

    // This variable is a collection of strings.  It can be used as such, or
    //  it can be autoconverted to a comma-seperated list as a string on demand.
    myCollection: {
        "x1",
        "x2",
    };
    
    // This produces a new collection by iterating through an existing collection.
    // I will not explain here why it has this syntax, that will be covered in
    //  our online documentation.
    // This will produce a new collection by stepping through each element in
    //  the source collection, processing the string after the '=' for variables,
    //  and adding the resultant string to the new collection.
    // This may be used in any location where a collection is accepted.
    //
    // The below results in a collection equivilent to:
    //    {"SUB1", "SUB2", "SUB3"}
    //
    myNewCollection: {
        myString => "" = "SUB${each}";
    };
}

/////////////////////////
//
//  Product Information
//
//  This is general information about the package(s) being built by this .buildinfo
//   file.  This information is mostly intended to help another developer fork
//   or help maintain this project.
//
#product-info  {
	product-name: "MyProject";
	version: "${package-version}";
	original-source-location: "«http://sourceforge.net/projects/MyProject/files/v1.0.1/MyProject-1.0.1.zip/download«»";
	original-source-website: "«http://sourceforge.net/projects/MyProject«»";
	license: "Apache license 2.0 -- «http://www.apache.org/licenses/LICENSE-2.0.html«http://www.apache.org/licenses/LICENSE-2.0.html»";
	packager: "Bob Smith <bs@emails.net>";
}

/////////////////////////
//
//  Build Rules
//
//  These are generally the heart of the build process.  Each build rule follows
//   the general pattern of:
//
//    <RuleName> {
//      <section/property name> : value;
//      <section/property name> : {
//          value1,
//          value2,
//          etc.,
//      };
//
//      ...
//
//    }
//
//  Individual sections will be described below.  The sections are listed
//   below in the order in which they are processed, but the order of placement
//   does not matter in practice.  Thus the 'default' property is always
//   processed before all other sections or properties, regardless of where it
//   is entered in the rule. For more details, read our online documentation:
//    «http://coapp.org/reference/ptk.html«http://coapp.org/reference/ptk.html»
//
//  Typical build rules include (but are definately not limited to):
//      test
//      package
//      release
//      sign
//
//  The contents generally found in these build rules are described in:
//    «http://coapp.org/developers/packagingbestpractices.html«http://coapp.org/developers/packagingbestpractices.html»
//
doStuff {
    // This property determines if this rule will be run by default when 'ptk'
    //  is called with no additional parameters.  It defaults to 'false' if 
    //  not present.  If multiple rules have this set, each of those rules will
    //  be run.
	default : true;

    // This section is used to set variables for use by this rule and any child
    //  rules that are used by this rule.  Any items set in here are also added
    //  and set as environment variables, and are thus not case sensitive.
    // Variables assigned in a 'set' section may safely self-reference for their
    //  initial value without worry of forming an endless loop.
    set : {
        all_compilers="vc6, vc7.1, vc8, vc9, vc10, mingw";
        COMP="${COMP??vc10}";
        PLAT="${PLAT??x86}";
    };
    
    // This section lists one or more other rules which must be run before this
    //  rule continues processing.
    uses : {
        other;
    };
    
    // This section lists any other packages which must be installed to continue
    //  processing this build rule.
    // Note: At present (devtools v1.2.0.108), do *NOT* specify all 4 parts of
    //       a dependency's version.  Doing so will prevent CoApp from accepting
    //       a newer version of the package to qualify the dependency.
    requires: {
        "zlib-dev[${COMP}]-1.2.5-${PLAT}-1e373a58e25250cb";
        "openssl-dev[${COMP}]-1.0-${PLAT}-1e373a58e25250cb";
    };
    
    // These three properties accept only one value each, but variables may be
    //  used by enclosing them in quotes.  These assign the sdk,achitecture,
    //  and compiler to be used when running the 'build-command' (if any) for
    //  this rule.
    // If one of these properties are omitted, it will default to its respective
    //  value listed here:
    //      sdk: sdk7.1;
    //      platform: x86;
    //      compiler: vc10;
    //
    // Additional information on these properties may be found online:
    //   «http://coapp.org/reference/ptk.html#platform«http://coapp.org/reference/ptk.html#platform»
    sdk: sdk7.1;
    platform: "${PLAT}";
	compiler: "${COMP}";
    
    // The 'build-command' property is a string variable which is converted
    //  into a DOS batch (.bat) file at runtime.
	build-command : @"
        for %%a in (${all_compilers}) do (
            echo %%a
        )
        REM Remember that this is a DOS batch file, but quotes must be doubled
        REM  to work properly without ending the build-command.
        echo ""This is a properly escaped quoted string in a ptk build-command.""
	";
    
    // This section is just a list of strings detailing what files to look for
    //  when the rule has completed.  If all target files are present, the rule
    //  succeeded.  If any are missing, the rule failed and ptk will halt with
    //  an error message.
    targets: { 
        @"output\${COMP}\${PLAT}\MyOutput.exe",
    };

}

// This rule requires nothing else, will run by default if no other rule 
//  is specified, and will print the current build environment, then exit.
other {
    build-command: "set";
}

```

