---
layout: 'article'
title: 'CoApp Packages - Best Practices' 
version: '1.0'
docid: 'reference:packagingbestpractices'
---
## Package building best practices
This document sets forth the standard guidelines the CoApp team uses for package building and publishing.  If you are a package developer and wish to have your package considered for direct publishing by the CoApp project, your package **must** follow these guidelines.

-----

* [File Locations](#files)
* [The .buildinfo file](#buildinfo)
* [*.autopkg files](#autopkg)
* [General Recommendations](#recommendations)

-----

### File locations[](!files)
All build and configuration files for CoApp tools must reside in the `COPKG` subdirectory of the project root.  The location of any other files is left to the discretion of the developer.  _Developers forking existing software projects should make an active effort to change as little as possible from the original project files outside of the `COPKG` directory.  This will allow for easier updates and merges from the upstream project over time._

e.g.
``` text
C:\MyProject> dir

<DIR>  COPKG  <-- All CoApp config files go here.
<DIR>  src
<DIR>  inc
<DIR>  lib
       MyProject.sln
       README
```

At a minimum, there must exist a `.buildinfo` file and at least one autopackage file (e.g. `MyProject.autopkg`).


### The .buildinfo file[](!buildinfo)
The following targets **must** be implemented in the `.buildinfo` file in any order.

1. [test](#Test-Target)
2. [package](#Package-Target)
3. [release](#Release-Target)

The following targets _should_ be implemented in the `.buildinfo` file.

1. [sign](#Sign-Target)
2. [debug](#Debug-Target)
3. [x86](#x86-Target)  (if applicable)
4. [x64](#x64-Target)  (if applicable)
5. [any](#Any-Target)  (if applicable)

#### [test](!Test-Target) target
This target should depend on the [Release](#Release-Target), and then run any project-specific tests that the developer provides.  _**\*It is expected that developers will provide tools and/or libraries for testing the function of their software.  The CoApp team WILL NOT perform additional tests on arbitrary packages before release.  Failure to provide testing functionality is grounds for removal from publishing by the CoApp team.\***_

Example:
``` text
test {
    uses: release;
    build-command: @"call MyTestRoutine.bat
mstest MyTestSuite.dll
MyTestProg.exe -doStuff";
};
```

#### [package](!Package-Target) target
This required target should call the [Sign](#Sign-Target) target (if present) and [Release](#Release-Target) target (as appropriate for the [Sign](#Sign-Target) target), followed by any post-build actions necessary to produce all intended final package files.  This includes running `AutoPackage` with any relevant `*.autopkg` files.

Example:
``` text
package {
    uses: sign;
    build-command: @"autopackage.exe COPKG\*.autopkg";
}
```

#### [release](!Release-Target) target
This required target is expected to set necessary environment variables, then either call the appropriate [x86](#x86-Target), [x64](#x64-Target), and/or [Any](#Any-Target) targets or provide direct build commands to produce officially releasable binaries/libraries/etc. for the project.

Example:
``` text
release {
    set: BuildCfg="Release";
    uses: {x86, x64};
}
```

#### [sign](!Sign-Target) target
This suggested target may operate in one of two ways at the developer's discretion:
1. This target may call the [Release](#Release-Target) target, followed by a script to run `simplesigner` on all relevant output files.
2. This target may assume that the [Release](#Release-Target) target has already been run and attempt to operate on the output files appropriately.

Example:
``` text
sign {
    uses: release;
    build-command: @"simplesigner.exe --nologo out\**.dll out\**.exe";
}
```

#### [debug](!Debug-Target) target
If present, it is expected that this target would set necessary environment variables and then call the relevant [x86](#x86-Target), [x64](#x64-Target), or [Any](#Any-Target) targets (or directly build the software if those targets are not provided).

Example:
``` text
debug {
    set: BuildCfg="Debug";
    uses: any;
}
```

#### [x86](!x86-Target), [x64](!x64-Target), [Any](!Any-Target) targets
These would typically be the individual sets of build commands for each targeted architecture.  If present, it is expected that each of these would contain all necessary information to build the project as either Debug or Release for the appropriate architecture.

Example:
``` text
any {
    targets:{
        MyLib.dll,
        MyProg.exe
    };
    build-command: @"if defined BuildCfg (
        msbuild /p:Configuration=%BuildCfg% MyProject.sln
        ) else (
        msbuild MyProject.sln
        )";
}
```


### *.autopkg files[](!autopkg)
Proper procedure dictates one `*.autopkg` file for for each type of package to be produced.  For example, if one wishes to package up a dynamically linked library for use by other software, this would typically have three (3) seperate `.autopkg` files.  Assuming that the library is titled `MyLib`, we would expect to see the following `.autopkg` files in the `COPKG` directory:
``` text
MyLib.autopkg				<== Will produce packages containing the end-user dlls
MyLib-dev.autopkg			<== Will produce packages containing developer linking libraries (.lib files)
MyLib-dev-common.autopkg	<== Will produce a package containing all relavent headers/include files.
									Generally also includes any developer documentation.
```

AutoPackage files may be constructed as described on the [AutoPackage][autopackage] page.

Package developers and maintainers wishing to have the CoApp team build their packages should make an active effort to provide for future extendability in their AutoPackage files.  By this it is meant that `.autopkg` files should be designed to accept and operate based upon variable input for the package flavor information (eg. `vc10`) and the system archetecture (eg. `x64`) as appropriate.  In addition, packaging information that is likely to change over time (such as the package version information) should be placed in a seperate file to be included by the AutoPackage files.

Example `version.inc` - Defines version info:
``` text
#define { package-version: "1.12.3.45"; } 
```

Partial example `MyLib.autopkg` - Includes version info and uses variables to produce package:
``` text
@import "version.inc";

#define { 
    flavor: "${comp??vc10}"; 
    arch : "${plat??x86}";
}

package {
    name: "MyLib[${flavor}]";
    version: "${package-version}";
    arch : "${arch}";
}

...
```

### General Recommendations[](!recommendations)
There are a few conventions that the CoApp team suggests using, but which are neither required nor enforced.

#### Output files
For the ease of future maintainers, we recommend copying or moving all final output files from the build process to a directory named `output` (or similar) in the root of the project.  It is generally desirable to have a directory structure similar to that shown below to enable smooth operation of build automation:

``` text
<DIR>  output
    <DIR>  vc9
        <DIR>  x86
            <DIR>  Release
        <DIR>  x64
            <DIR>  Release
    <DIR>  vc10
      .
      .
      .      
```

That is, the desired final location of a file to be packaged would be `.\output\{flavor}\{arch}\{configuration}\<filename>`.

#### Build variables
It is highly encouraged for package maintainers to use property sheet variables whenever possible for conditions which may change from one developer to the next or within the same common build command.  This would include such things as the compiler to build with, the architecture being targeted, and the type of build configuration (Debug or Release, for example).  Below we can see an example of how use of these variables can greatly reduce clutter and confusion within a .buildinfo file:

``` text
test{
    set: COMPILERS="${COMPILERS??vc8, vc9, vc10}"; //If COMPILER is not assigned already, set it to "vc8, vc9, vc10"
    uses: release;
    build-command: @"
        for %%A in (${COMPILERS}) do (
            pushd output\$$A\any\Release\
            runTest.exe
            popd
        )
    ";
};

release{
    set: COMPILERS="${COMPILERS??vc8, vc9, vc10}"; //Same effect as in the 'test' target
    build-command: @"
        for %%A in (${COMPILERS}) do (
            ptk build --CONFIG=Release --COMP=%%A
        )
    ";
};

build{
    set: {
        CONFIG="${CONFIG??Debug}";
        COMP="${COMP??vc10}";
    }
    
    compiler: ${COMP};
    platform: any;
    
    build-command: @"
        msbuild /p:Platform="Any CPU" /p:Configuration=${CONFIG} windows\${COMP}\Project.sln
        md output\${COMP}\any\${CONFIG}\
        copy windows\${COMP}\bin\${CONFIG}\* output\${COMP}\any\${CONFIG}\
    ";
}
```

The above `.buildinfo` file is highly versatile, being able to build for any combination of compilers (not necessarily only the 3 already listed) and able to accommodate debugging out of the box and a `package` target can be readily added with only a few additional lines.

To use the above `.buildinfo` file, we could use any of the following command line entries for varied results:

`ptk test`  ==> will build the project under VC8, VC9, and VC10 and will run the appropriate build of tests against each one
`ptk release --COMPILERS=vc9`  ==> will build a release version of the project in only VC9, no tests are run
`ptk build`  ==> will build a debug version of the project in VC10 (the listed default for that target)
`ptk release --COMPILERS="vc6, vc71"`  ==> assuming that the necessary solution files are in the correct locations, this will build release versions of the project in both VC6 and VC7.1 (VC 2003)

[autopackage]: </developers/autopackage.html>
