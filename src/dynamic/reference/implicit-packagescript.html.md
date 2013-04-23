---
layout: 'article'
title: 'Implicit AutoPackage Script' 
version: '0.5'
---
<div class="alert-message warning">
    <p>This is a draft document -- send feedback to tiroger@microsoft.com</p>
</div>
## Implicit AutoPackage Script

This package script is automatically loaded before the the first `.autopkg` file being referenced.

##### [#defines](!defines)
``` css
#defines { 
    ElementId = "";
    conditionFolder = ${ElementId};
}
```

##### [Configurations](!Configurations)
``` css
configurations {
    Toolset { 
        key : "PlatformToolset"; 
        choices: { v110, v100, v90, v80, v71, v70, v60, gcc };  
    };
    
    Platform {
        key : "Platform"; 
        choices: { Win32, x64, ARM, AnyCPU };
        Win32.aliases : { x86, win32, ia32, 386 };
        x64.aliases : { x64, amd64, em64t, intel64, x86-64, x86_64 };
        ARM.aliases : { arm, woa };
        AnyCPU.aliases : { anycpu, any };
    };

    Configuration {
        key : "Configuration"; 
        choices: { Release, Debug };
    };

    Linkage { 
        choices : { dynamic, static, ltcg, sxs };
        description = "Which version of the .lib file to link to this library";

        ltcg.description = "Link Time Compiler Generation";
        dynamic.description = "Dynamic Library (DLL)";
        static.description = "Static";
        sxs.description = "Side-by-Side";
    };

    // Only really applicable to x86
    CallingConvention {
        choices : { cdecl, stdcall, fastcall, thiscall, clrcall };
        description = "Calling convention model to use (for x86 only)";
        cdecl.description = "cdecl";
        stdcall.description = "stdcall (Uncommon)";
        fastcall.description = "fastcall (Rare)";
        thiscall.description = "thiscall (Rare)";
        clrcall.description = "clrcall (Rare)";

        stdcall.restricted-to = "Win32";
        fastcall.restricted-to = "Win32";
        thiscall.restricted-to = "Win32";
        clrcall.restricted-to = "Win32";
    };
}
```
    
##### [nuget](!nuget)
``` css
nuget := {
    // built-in defines 
    #defines { 
    
        framework      = native,
    
        content_root   = \content\${framework},
        tools_root     = \tools\${framework},
        lib_root       = \lib\${framework},
        build_root     = \build\${framework},
        src_root       = \src,

        d_include   = ${build_root}\include\${conditionFolder},
        d_docs      = ${build_root}\docs\${conditionFolder},
        d_bin       = ${build_root}\bin\${conditionFolder},  
        d_lib       = ${build_root}\lib\${conditionFolder},
        d_tools     = ${tools_root}\${conditionFolder},
		d_src       = ${src_root}

        // since the generated msbuild props/targets files are always in a directory 
        // two deep from the package root.
        pkg_root    = $(MSBuildThisFileDirectory)..\..\,
    };
    
    // one of the pivots for the targets/props []  parameter.
    #output-packages {
        default : ${pkgname};
        redist : ${pkgname}.redist;
		symbols : ${pkgname}.symbols;
    }

    files {
        #output {
            package = default;
            // framework = ${framework};
            // project = targets;
        };

        bin += {  
            #output {
                package = redist;
            };
            #add-each-file : ::nuget.[redist]targets.[${condition}].CopyToOutput;
            #destination : ${d_bin};  
        };

		symbols += {  
            #output {
                package = symbols;
            };
            #destination : ${d_bin};  
        };

		source += {  
            #output {
                package = symbols;
            };
            #destination : ${d_src};  
        };

        tools += {  
            #output {
                package = redist;
            };
            
            #add-folder : ::nuget.targets.[${condition}].BuildTimePath;
            #destination : ${d_tools};  
        };

        lib += { 
            // add each file as a link rule
            #add-each-file : ::nuget.targets.[${condition}].Libraries;
            #flatten = true;
            #destination = ${d_lib}; 
        };

        include += { 
            #add-folder : ::nuget.targets.[${condition}].Includes;
            #destination : ${d_include}; 
        };

        docs += { 
            #destination : ${d_docs};   
        };
    };
    
    
    targets {
        @alias Includes = ItemDefinitionGroup.ClCompile.AdditionalIncludeDirectories;
        @alias Defines = ItemDefinitionGroup.ClCompile.PreprocessorDefinitions;
        @alias Libraries = ItemDefinitionGroup.Link.AdditionalDependencies;
        // BuildTimePath : "";
        // CopyToOutput : "";
    }
    
    props {
        @alias Includes = ItemDefinitionGroup.ClCompile.AdditionalIncludeDirectories;
        @alias Libraries = ItemDefinitionGroup.Link.AdditionalDependencies;
        @alias Defines = ItemDefinitionGroup.ClCompile.PreprocessorDefinitions;
        // BuildTimePath : "";
        // CopyToOutput : "";
    }
}
```

