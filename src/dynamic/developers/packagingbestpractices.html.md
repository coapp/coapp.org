---
layout: 'article'
title: 'CoApp Packages - Best Practices' 
version: '1.0'
docid: 'reference:packagingbestpractices'
---
## Package building best practices
This document sets forth the standard guidelines the CoApp team uses for package building and publishing.  If you are a package developer and wish to have your package considered for direct publishing by the CoApp project, your package **must** follow these guidelines.

### File locations
All build and configuration files for CoApp tools must reside in the `COPKG` subdirectory of the project root.  The location of any other files is left to the discretion of the developer.

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


### The .buildinfo file
The following targets **must** be implemented in the `.buildinfo` file in any order.

1. [test](#Test-Target)
2. [package](#Package-Target)
3. [release](#Release-Target)
4. [sign](#Sign-Target)

The following targets _should_ be implemented in the `.buildinfo` file.

1. [debug](#Debug-Target)
2. [x86](#x86-Target)  (if applicable)
3. [x64](#x64-Target)  (if applicable)
4. [any](#Any-Target)  (if applicable)

#### [test](!Test-Target) target
This target should depend on the [Release](#Release-Target), and then run any project-specific tests that the developer provides.  _**\*It is expected that developers will provide tools and/or libraries for testing the function of their software.  The CoApp team WILL NOT perform additional tests on arbitrary packages before release.  Failure to provide testing functionality is grounds for removal from publishing by the CoApp team.\***_

Example:
``` text
test {
    uses: release
    build-command: @"call MyTestRoutine.bat
mstest MyTestSuite.dll
MyTestProg.exe -doStuff"
}
```

#### [package](!Package-Target) target
This required target must call the [Sign](#Sign-Target) and [Release](#Release-Target) targets (as appropriate for the [Sign](#Sign-Target) target), followed by any post-build actions necessary to produce all intended final package files.  This includes running `AutoPackage` with any relevant `*.autopkg` files.

Example:
``` text
package {
    uses: sign
    build-command: @"autopackage.exe COPKG\*.autopkg"
}
```

#### [release](!Release-Target) target
This required target is expected to set necessary environment variables, then either call the appropriate [x86](#x86-Target), [x64](#x64-Target), and/or [Any](#Any-Target) targets or provide direct build commands to produce officially releasable binaries/libraries/etc. for the project.

Example:
``` text
release {
    set: BuildCfg="Release"
    uses: x86
    uses: x64
}
```

#### [sign](!Sign-Target) target
This required target may operate in one of two ways at the developer's discretion:
1. This target may call the [Release](#Release-Target) target, followed by a script to run `simplesigner` on all relevant output files.
2. This target may assume that the [Release](#Release-Target) target has already been run and attempt to operate on the output files appropriately.

Example:
``` text
sign {
    uses: release
    build-command: @"simplesigner.exe --nologo out\**.dll out\**.exe"
}
```

#### [debug](!Debug-Target) target
If present, it is expected that this target would set necessary environment variables and then call the relevant [x86](#x86-Target), [x64](#x64-Target), or [Any](#Any-Target) targets (or directly build the software if those targets are not provided).

Example:
``` text
debug {
    set: BuildCfg="Debug"
    uses: any
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
    }
    build-command: @"if defined BuildCfg (msbuild /p:Configuration=%BuildCfg% MyProject.sln) else (msbuild MyProject.sln)"
}
```


### *.autopkg files
These need to be constructed to build any package files you wish to publish.  Proper procedure is to have one `*.autopkg` file for for each msi output.
_This section under construction_

