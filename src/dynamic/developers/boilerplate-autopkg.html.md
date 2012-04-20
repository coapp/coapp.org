---
layout: 'article'
title: 'AutoPackage Boilerplate File'
version: 1.0
---

``` c#
///////////////////////////////////////////////////////////////////////////
//
//  Boilerplate:  .autopkg file
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
//   - compat.inc  -- Contains the current compatability policy for the package.
//   - <ID>.inc    -- Contains any information expected to be common among all
//                     packages you may build.  This often contains at least
//                     an 'identity' role.
//
@import "«version.inc«/developers/example-imports.html»";
@import "«compat.inc«/developers/example-imports.html»" ;
@import "«outercurve.inc«/developers/example-imports.html»";

/////////////////////////
//
//  Defines
//
//  This section initializes custom variables to be used elsewhere in the document.
//  Variables may be set to specific values or to conditionally resolved statements.
//  As a general rule, inner variables to be resolved should be lowercase if 
//   expected to be input from the command line.
//
//  ** NEVER SET A VARIABLE BY SELF REFERENCE! **
//  ** DOING SO WILL CAUSE AUTOPACKAGE TO LOOP FOREVER TRYING TO RESOLVE IT **
//
//  This is ok:   MyVar: "${var??OptionA}";
//  This is BAD:  other: "${other??We'll never get here...}";
//
#define { 
    flavor: "${comp??vc10}"; 
    arch : "${plat??x86}";
}

/////////////////////////
//
//  Package Information
//
//  This section is required for all packages.  The 
//
package {
    name: "MyPackage[${flavor}]";
    version: "${package-version}";
    arch : "${arch}";
    
    display-name: "MyPackage";
    location: "http://coapp.org/repository/${OutputFilename}";

    feed: "http://coapp.org/repository/packages.atom.xml";
    publisher: "CoApp Project";
}

/////////////////////////
//
//  License Descriptions
//
//  Adjust these to match the license(s) for your package.
//  These will act as placeholders for use later in this document.
//
license[Apache] {
    license-url: "www.apache.org/licenses/LICENSE-2.0.html";
    license-type: "Apache";
}
license[LGPL2] {
    license-url: "http://www.gnu.org/licenses/old-licenses/lgpl-2.0.html";
    license-type: "LGPL";
}

/////////////////////////
//
//  Dependencies
//
//  These are examples of dependencies to this package.
//  Items of note:
//    - At present (devtools v1.2.0.108), do *NOT* specify all 4 parts of a dependency's version.
//       Doing so will prevent CoApp from accepting a newer version of the package to qualify the dependency.
//    - Be careful with the use of "${Package.PublicKeyToken}" for specifying the publisher to use.
//       Using this instead of a specific token will require that that required package also be built by every publisher who builds this package.
//    - For reference, the official CoApp public key token is:  1e373a58e25250cb
//
requires {
    package: "zlib[${flavor}]-1.2.5-${Package.Architecture}-${Package.PublicKeyToken}";
	package: "libiconv[${flavor}]-1.13.1-${Package.Architecture}-1e373a58e25250cb";
	package: "openssl[${flavor}]-1.0.0-${Package.Architecture}-1e373a58e25250cb";
	package: "libxml2[${flavor}]-2.7.8-${Package.Architecture}-1e373a58e25250cb";
	package: "lua[${flavor}]-5.2.0-${Package.Architecture}-1e373a58e25250cb";
}

/////////////////////////
//
//  Package Metadata (general information)
//
//  Various general information about this package.  While not *strictly* required, it is VERY highly encouraged that as much of this as possible be provided.
//
metadata {  
    summary: "MyPackage"; // or a more user-friendly name
    description: @"Description of MyPackage.";
    author-version : "2.5 (beta)"; // may contain alphanumeric characters, not limited to 4-part version
    bug-tracker: "https://github.com/coapp-packages/MyPackage/issues";
    stability : "-10"; // -100 to 100, 0 is considered "normal"/stable, higher is more stable
    licenses : {
        Apache
    };
}

/////////////////////////
//
//  Signing Information
//
//  This section is only required if all relavent files were not already signed beforehand.
//  It is generally included regardless because having it when not needed doesn't hurt anything.
//
signing {
    attributes : {
        company="Outercurve Foundation",
        description="Description of MyPackage",
        product-name="MyPackage",
        product-version="${package-version}",
        file-version="${package-version}",
    };
    
    replace-signature: true; 
    include: { 
        files-to-sign
    };    
}

/////////////////////////
//
//  Manifests
//
//  Anything in this package which will need to make calls to a dll in another 
//   package will need manifests generated and attached to look up where those
//   library files are.
//
//  If there are multiple different sets of manifests that need to be added, this
//   rule may be listed multiple times.  There is also nothing which prevents one
//   manifest entry for each assembly being referenced, however that would take
//   a great deal of space and reduce readability.  Doing so when not necessary
//   is generally considered rude.
//
manifest[arbitraryName] {
    // The 'assembly' section lists all items in SxS which need to be referenced.
    assembly : {
        "zlib[${flavor}]",
		"libiconv[${flavor}]",
		"openssl[${flavor}]",
		"lua[${flavor}]",
		"libxml2[${flavor}]",
		"MyLib[${flavor}]",
    };
    
    // The 'include' section lists files (or sets of files) which will need to
    //  reference the above assemblies.
    include : { 
        exes,
		modules,
    };
}
manifest[OtherName] {
    // same with our library as with the exes, only we don't need to manifest with ourself
    assembly : {
        "zlib[${flavor}]",
		"libiconv[${flavor}]",
		"openssl[${flavor}]",
		"lua[${flavor}]",
		"libxml2[${flavor}]",
    };
    
    include : { 
        dlls,
    };
}

/////////////////////////
//
//  Assembly role
//
//  These are items that will need to be made available in SxS to be referenced
//   by other software.  These files will ONLY be placed in SxS, not the 
//   application directory, so a manifest will be needed to reference them.
//  If this package will contain multiple discrete assemblies/libraries that may
//   need to be referenced seperately, this role may be listed multiple times
//   with different assembly names.
//
assembly[MyLib[${flavor}]] {
    include : {
        dlls
    };
}

/////////////////////////
//
//  Developer Library role
//
//  This role handles installing headers, link-libraries, and developer docs for
//   a library.  While it is possible to have both an 'assembly' and a
//   'developer-library' role declared in the same package, doing so is considered
//   very bad form, as it means the developer libraries will always be included
//   when an end-user just needs to use the dll.
//  Standard practice for a library is to seperate it into 3 packages:
//   - End-user library (.dll)
//   - developer library (link-libraries)
//   - developer common files (header files and documentation)
//
//  The example roles below depict typical entries from dev and dev-common
//   packages respectively.
//  Please note that proper use of naming conventions is important in both cases.
//
developer-library[MyLib[${flavor}]] {
    libraries : {
        libs,
    };
}
developer-library[MyLib] {
    headers: { 
        headers
    };
    
    docs: {
        docs
    };
}

////////////////////
//
//  Application role
//
//  All files listed here will be included in the application directory.
//
application {
    include : {
        exes,
		modules,
		logs,
    };
}

////////////////////
//
//  Package Composition
//
//  This rule lists file operations to be performed after all files have been
//   installed according to any package roles listed.
//
//  For a full list of options here and how they work, see:
//    http://coapp.org/developers/autopackage.html#composition-rule
//
package-composition {
    symlinks : { 
        exes => @"${bin}\${each.Name}" = @"${packagedir}\${each.Name}";
    };

    file-copy : {
        logs => "${etc}\MyPackage\logs\${each.Name}";
    };
}

//////////////////
//
//  Files
//
//  These rules are used to more easily designate sets of files to be used elsewhere.
//  For details on how this rule is used see:
//    http://coapp.org/developers/autopackage.html#files-rule
//
files[files-to-sign] {
    include: { 
        dlls,
		exes,
		modules,
    };    
}
files[dlls] {
    root: @"..\output\${flavor}\${arch}\Release";
  
    include: {
        "*.dll",
    };
    
    trim-path: all;
};

files[exes] {
    root: @"..\output\${flavor}\${arch}\Release";
  
    include: {
		"a.exe",
		"b.exe",
		"MyProg.exe",
    };

    trim-path: all;
};

files[modules] {
    root: @"..\output\${flavor}\${arch}\Release\modules";
  
    include: {
        "**.mod"
    };
    
    trim-path: minimal;
    destination: "modules";
};

files[logs] {
    root: @"..\init";
  
    include: {
        "MyProg.log",
    };
    destination: "logs";
    trim-path: all;
};

files[libs] {
    root: @"..\output\${arch}\Release\";
    
    include: {
        "MyLib.lib",
    };
    
    trim-path: all;
};

files[headers] {
    root: @"..\include";
    include: {
        "**.h"
    };
    
    trim-path:minimal;
}

files[docs] {
    root: @"..\docs\";
    include: {
        "**"
    };
    
    trim-path:minimal;
}
```

