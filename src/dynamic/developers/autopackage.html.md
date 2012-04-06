---
layout: 'article'
title: 'Making AutoPackage Files'
version: 0.5
---

This document details the thought process for generating a `.autopkg` file to produce the desired output.  For details on all possible fields of an AutoPackage file, [look here][ref-autopackage].

-----

* [Required Rules](#required)
    * [Package](#package-rule)
    * [files[]](#files-rule)
    * [Package-composition](#composition-rule)
    * [Requires](#requires-rule)
    * [Manifest](#manifest-rule)
    * [Roles](#roles)
        * [application](#application-role)
        * [developer-library](#devlib-role)
        * [assembly](#assembly-role)
* [Frequently Used Rules](#frequent)
* [Other Optional Rules](#optional)

-----

## [Minimum Required Rules](!required)

#### [Package](!package-rule)
This contains much of the basic descriptive information about a package.
``` c#
package {
    name: "MyPackage";	// Name or title of package.  This is also called the "common name"
    version: "1.2.3.4";			/* Must be a 4-part version string:  "a.b.c.d"
    								a = Major version
    								b = Minor version
    								c = Revision (It is highly discouraged for binary-breaking changes 
    									to occur on a revision change.)
    								d = Build number (A change of build number should NEVER break binary
    									compatibility unless another part of the version number has also
    									changed.)
    							   Software with only 2- or 3-part versions should be left-justified, with
                                    the build and revision numbers padded out to form a 4-part version.
    							   As a general rule, the build number should never be less than "1".
    							*/
    arch: [x86 | x64 | any];	// Any particular package should be for exactly ONE of these architectures.
}
```

#### [files[]](!files-rule)
This rule can be declared multiple times, each with a different `reference_name`.  This is used to group similar files to be referenced by other rules.  While not strictly necessary by itself, the use of it is _highly encouraged_ to improve the readability of the .autopkg file.
``` c#
files[AppFiles] {
    root: @"..\output";		// The location to start looking for files in, relative to the COPKG dir.
    
    include: {
        "*",				// include all files in this directory in the group
        "**.exe"			// include all files with a ".exe" extention from this and all subdirectories
    }
    
    trim-path: [minimal, all];	/* select directory heirarchy for this group of files:
    								minimal = This will keep the directory structure relative to the files'
    											present locations.
    											(eg. ../output/bin/stuff.exe will be stored as ./bin/stuff.exe)
    								all = This will flatten any directory structure present.
    											(eg. ../output/bin/stuff.exe will be stored as ./stuff.exe)
    							*/

    destination:  "bin";	/* This is generally omitted, but can be used to set the root output path for
    							this group of files at the output location.
    						*/
}
```

#### [Package-composition](!composition-rule)
This is a critical part of any [application](#application-role) package, though it is generally omitted in [assembly](#assembly-role) packages.
``` c#
package-composition {
	/*  Sections which operate on files follow the following syntax:
        	<file_group_reference>  =>  ( <output> | <operations on each file> )
    */
    file-rewrite: { 
        /* Files in this section are passed through the CoApp macro parser and the
        	resulting files are output with the filenames as specified.
        */
        config-files => "rw_${each.Name}"
        /* Every file that was specified in a "files[config-files]" rule will be read,
        	any known variables (eg. ${bin}, ${appdir}, etc.) will be processed, and
            the resulting output file will be written in the same location with filename
            prefixed with "rw_".
        */
    };
    
    file-copy: {  
        /* These files will be copied to the specified directory, as is.  No parsing
        	will be done on these files, although this method may be used to rename them.
        */
        config-files => "${appdir}\config\${each.Name}";
    };
    
    symlinks : {
        /* If the application needs to be present in the path, or if a script or .ini file
        	needs to be reachable in a specific location, this will add a symlink in that
        	location which points to the actual file listed.  This is typcially used with
        	file groups.
        */
        exes => @"${bin}\${each.name}" = @"${appdir}\${each.name}";
        scripts => @"${coapp}\scripts\powershell\${each.name}" = @"${appdir}\scripts\${each.name}";
    }    

    environment-variables: {
        // This sets system-wide environment variables.  These are *NOT* user specific.
        "RUBYPATH" = "${appdir}";
    };
    
    registry: { 
        /* This will set a key in the Windows Registry.  These are always set in:
        		HKey_Local_Machine\Software\
           CoApp will also redirect the key as appropriate for x86 and x64 applications
        	to match Windows' built-in registry redirection.
           The syntax is:
        	@"<Keyname>\<subkey>#<value_name>" = @"<value>";
           Which will result in the following registry key:
        	HKLM\Software\<Keyname>\<subkey> : <value_name> = <value>
        */
        @"MyApp#InstallLocation" = @"${APPDIR}";
    };
}
```

#### [Requires](!requires-rule)
This rule is necessary if this package depends on other CoApp packages.
``` c#
requires {
    package: "MyLib-1.2.3-any-aaaabbbbccccdddd";
    // or
    package: {
        "LibA-2-x86-1111222233334444",
        "LibB-9.1-x86-ffff0000ffff0000"
    };
}
```
<span class="label warning">Note!</span>  Please note that the version listed is a partial version and not a 4-part version.  Providing a full 4-part version in the package identifier will bind against that **EXACT** version, and will not accept an alternate (binary compatable) installation.  By providing a partial version, CoApp will look for any binary compatable version of the package specified that is at least the version specified.

#### [Manifest[]](!manifest-rule)
If your package links to assemblies in another CoApp package, it may be necessary to embed a manifest into any files from this package which uses those other assemblies.  If your files need to link to multiple other assemblies, one `manifest[]` section will be required for each other assembly.
``` c#
manifest[zlib] {
    assembly : {
        // This is the assembly name to reference.
        // It must be the name of an assembly from a package in the "requires" rule. (see «assembly role«#assembly-role» below)
        "zlib[vc10]"
    };

    include {
        // This is the set of files which need to reference the above assembly.
        // It can be a single file, a list of files, or the name of a file group.
        "AppFiles"
    }
}
```

### [Roles](!roles)
Roles are a specific type of rule that provides context to CoApp and AutoPackage about the package being created or installed.  At least one role must be present in an AutoPackage file, though having more than one is allowed.  Any place where a `<set_of_files>` is specified, the section will accept a single file, a list of files, or the name of a file group defined elsewhere.

#### [application](!application-role)
This role is used to package an executable application.  Frequently an application package will depend upon many [assembly](#assembly-role) packages, which must be listed in a [requires](#requires-rule) rule and referenced by way of [manifest](#manifest-rule) rules.
``` c#
application[AppName] {
    include: {
        // Files listed here will be installed to an application folder.
        <set_of_files>
    }
}
```

#### [assembly](!assembly-role)
This role specifies shared libraries which are dynamically linked to by other assemblies and [applications](#application-role).
``` c#
assembly[<AssemblyName>] {
    include: { 
        // These files will be stored in Side-by-Side as a versioned assembly named <AssemblyName>
        <set_of_files>
    };
}
```


#### [developer-library](!devlib-role)
Used to specify a developer link-library and associated headers.  Typically a package with this role will either include an [assembly](#assembly-role) role containing the related end-user library or will list the package containing it in a [requires](#requires-rule) rule.
``` c#
developer-library[<LibName>] {
    headers: { 
        // These will automatically have links made in %AllUsersProfile%\include\<LibName>\
        <set_of_files>
    }
    libraries: { 
        // These will automatically have links made in %AllUsersProfile%\lib\${package.arch}\
        <set_of_files>
    }
    docs: { 
        <set_of_files>
    }
}
```

## [Frequently Used Rules](!frequent)

#### metadata

#### compatability-policy

#### signing

#### license

#### #define

## [Other Optional Rules](!optional)

#### identity

#### provides
<span class="label success">Coming soon!</span>

[ref-autopackage]: </reference/autopackage.html#autopkg>
