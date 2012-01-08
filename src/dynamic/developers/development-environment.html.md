---
layout: 'article'
title: 'Setting up the developer environment' 
version: '1.0'
docid: "developer:development-environment"
---
### Requirements
You'll need the following in order to correctly set up your development environment for working on CoApp:

- **Git, putty, and a GitHub account** -- see [Getting setup with Git and GitHub](/developers/git.html)
- **Visual Studio 2010** (either VS2010 professional, or the free [Visual C# Express](http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-csharp-express) and the free [Visual C++ express](http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-cpp-express) )
- **Windows SDK 7.1** [Download](http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=8279)
- **Windows WDK** [Download](http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=11800)
- **Visual Studio SP1** [Download](http://www.microsoft.com/download/en/details.aspx?id=23691)

### Note!
I only do development on an x64 install of Windows these days. Compiling the x64 parts of CoApp would be difficult, so if you're running on an x86 (32-bit) install of Windows, you're on your own.

### Installation
Installation of the developer tools is fairly straightforward, with only one thing worth noting.

<div class="alert-message error">
<p><b>Order of installation is very important!</b></p>  
</div>

If you don't install the tools in the correct order, the SDK will often have troubles installing. I've warned you. 

The order you should install the tools in:

1. Visual Studio 2010 (Either the full professional/ultimate version or the two express versions)
2. Windows SDK 7.1
3. Windows WDK (we use this for the msvcrt library in the bootstrap module)
4. Visual Studio SP1

Beyond that, I'd recommend that you just install it to the default locations and you should be good to go.

### Compiling from the command line

Since Visual Studio and the SDK (and the WDK for that matter) install a "command prompt" you can use to compile from, we suggest using the one labeled "Windows SDK 7.1 Command Prompt"

@[Windows SDK 7.1 Command Prompt](/images/tutorials/devenv-1.png)

From that prompt, you can switch from an 'x64' to an 'x86' configuration using the command:

``` bat

C:\Program Files\Microsoft SDKs\Windows\v7.1> setenv /x86

Setting SDK environment relative to C:\Program Files\Microsoft SDKs\Windows\v7.1\.
Targeting Windows 7 x64 Debug

C:\Program Files\Microsoft SDKs\Windows\v7.1>_

```

and back:

``` bat

C:\Program Files\Microsoft SDKs\Windows\v7.1> setenv /x64

Setting SDK environment relative to C:\Program Files\Microsoft SDKs\Windows\v7.1\.
Targeting Windows 7 x64 Debug

C:\Program Files\Microsoft SDKs\Windows\v7.1>_


```
