---
layout: 'article'
title: 'Creating Self-signed Signing Certificates'
version: 1.0
---
### Prerequisites:
* Windows SDK 7.1

### Instructions:
To produce a self-signed certificate on Windows that can be used for signing CoApp packages, we need to create an installable certificate, install it into a certificate store, and then export a .pfx file from it.  __All below commands must be entered in a Windows SDK command prompt (*this is not the same as a standard command prompt!*).__

1. [Creating an installable certificate](#create)
2. [Installing a certificate](#install)
3. [Exporting a .pfx signing file](#export)

#### 1. [Creating an installable certificate](!create)
To generate a new installable self-signed certificate, enter the following:
``` text
makecert -pe -ss MY -sr LocalMachine -$ individual -n "CN=<CertName>" -len 2048 -r "<CertName>.cer"
```
This will generate an installable certificate file named `<CertName>.cer` in the current directory.

#### 2. [Installing a certificate](!install)
To install a certificate file (like the one made in the previous step), enter the following:
``` text
CertMgr.exe /add "<CertName>.cer" /s /r localMachine root
```
This will install the `<CertName>` certificate into the `LocalMachine\root` certificate store.

#### 3. [Exporting a .pfx signing file](!export)
To export a private key signing file for an installed certificate, enter the following:
``` text
certutil.exe -privatekey -exportpfx "<CertName>" "<CertName>.pfx"
```
This will create a `<CertName>.pfx` signing key in the current directory.  This .pfx file can be used by SimpleSigner to sign package files.

