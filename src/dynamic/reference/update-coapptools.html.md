---
layout: 'article'
title: 'Update-CoAppTools Cmdlet' 
version: '1.0'
---

## SYNOPSIS 

Downloads the most recent version of the CoApp PowerShell tools and installs it.

## SYNTAX

``` powershell
	Update-CoAppTools [-Beta] [-KillPowershells]

```

## DESCRIPTION

This cmdlet looks online for the most recent build of the CoApp PowerShell tools (found online at http://downloads.coapp.org/files/CoApp.Tools.Powershell.msi), downloads the MSI and compares the version to the version currently running.

If the version downloaded is a higher version, it proceeds to install the updated MSI.

**PARAMETERS**

**-Beta** *<SwitchParameter>*

If specified, will retrieve the latest 'beta' build (newer, but possibly less stable than the default). Found online at http://downloads.coapp.org/files/Beta.CoApp.Tools.Powershell.msi

**-KillPowershells** *<SwitchParameter>*

If specified, will attempt to kill all the PowerShell processes after kicking off the installer. (May require administrator permissions).

**-Quiet** *<SwitchParameter>*

Suppress output of all non-essential messages

**-Verbose** *<SwitchParameter>*

Prints a lot of extra details about the process. May be useful for debugging.



## RELATED LINKS

Online Help: [http://coapp.org/reference/update-coapptools.html](http://coapp.org/reference/update-coapptools.html)
Report Bugs To: [https://github.com/coapp/coapp.powershell/issues](https://github.com/coapp/coapp.powershell/issues)


