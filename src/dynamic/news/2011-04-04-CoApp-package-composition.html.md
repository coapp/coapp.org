---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp Package Composition
tags: ['developer']
docid: "news:20110404"
---

(cross-posted to the [mailing list][developer:mailinglist])

When CoApp packages are installed, they install into a predetermined location based on the package metadata-this ensures that all packages play by the rules, and allow us to use Windows features to support things side-by-side installation of applications (ie, havin' two versions of the same application installed concurrently), and also to ensure that **we never, ever require a reboot** to install software (even if a previous version of the software is currently running).

For most packages, this follows a format something like:

``` text
c:\apps\.installed\PUBLISHERNAME\PRODUCT-VERSION-PLATFORM\
```

which means that for a given package (say, CoApp's command line toolkit) the files would get installed into:

``` text
c:\apps\.installed\OUTERCURVE FOUNDATION\coapp.toolkit-1.0.2.338-any
c:\apps\.installed\OUTERCURVE FOUNDATION\coapp.toolkit-1.0.2.338-any\coapp.exe
```

Of course, this predefined location is nether attractive, nor trivial for the end user (or other software) to use, so we like to ensure that packages can expose themselves in a consistent and familiar manner. The process that CoApp has to accomplish this is called **Package Composition**.

In CoApp V1, Package Composition is fairly limited; it's intended to create canonical directories, EXE links and shortcuts for packages so that they can be easily be referenced by users and developers without much trouble. In CoApp V2, Package Composition will provide a method for publishers to define how third-party plugins, libraries and extensions can be cleanly published without polluting the application's install directory with files that really don't belong there.

In CoApp V1, we see a package expose itself by creating a canonical location for the package and optionally publish EXEs in the PATH. The canonical location for a given (application) package follows the following format:

``` text
c:\apps\PRODUCT\
```

Pretty easy, eh? ... So that means we see CoApp's command line toolkit visible here:

``` text
c:\apps\coapp.toolkit\
c:\apps\coapp.toolkit\coapp.exe
```

And the EXE should show itself in the PATH, by appearing in the common:

``` text
c:\Apps\bin
```

directory (which is placed in the PATH), like this:

``` text
c:\Apps\bin\coapp.exe
```
Of course, we really don't want multiple *copies* of all these things littering the drive, so we're using NTFS [symbolic links](http://en.wikipedia.org/wiki/Symbolic_link) (aka symlinks) to have the file system merely appear that way (somewhat like UNIX).

## Symlinks On Windows

Starting with Windows Vista, NTFS supports symbolic links (often called soft-links), in a manner extremely similar to UNIX (and brethren). Yay! This is awesome; we can easily use symlinks to redirect the files and directories that we're interested in back to the original installed location (c:\apps\.installed...) and not duplicate files.

This is also the secret mojo we've needed to allow applications to install side-by-side with other versions of itself. It turns out that if you run an EXE via a symlink, it doesn't lock the **link**, it locks the **target**. This means we can remove the linked version in c:\apps\bin and create a new link to the new version, and the currently running program doesn't freak out.

Now, my pappy always used to say **"this is all goin' down too easy; I'm still waitin' to find the mouse at the bottom of this can of beans!"**

The proverbial mouse in this case is that Windows XP and Windows Server 2003 don't actually support symbolic links-but they do have a couple of thinks we can use to achieve nearly the same goal.

For directories, there are [junctions](http://en.wikipedia.org/wiki/NTFS_junction_point). Junctions are really close to symbolic links (they have some limitations, like you can't have a junction to a file across UNC, and they have to be absolute paths). Fortunately, this is minor potatoes-we are only interested in having directories locally, and we don't need to use relative paths.

For files, it was lookin' like we was plumb out of luck-except we do have something called [hard links](http://en.wikipedia.org/wiki/Hard_link). Hard links actually allow more than one directory entry on the hard disk to physically point to the same file on disk. While this gets around the trouble with actually duplicating the file on disk, if you run an application via the hard link (ie, run c:\apps\bin\coapp.exe ) and try to remove the link, it'll fail while the application is running.

Luckily, there **is** something we can do to a file that is locked. We can move it - or rename it - **even while it's in use**. Using this, we can move the locked file out of the way, create a link to the new version, and we're happy as horses. If the file is locked, we'll queue it up to actually get deleted on reboot (by using [MoveFileEx](http://msdn.microsoft.com/en-us/library/aa365240(v=vs.85).aspx) which stuffs it into the registry at ```HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\PendingFileRenameOperations```).

The only trouble that I can see is when you make a hard-link, there really isn't an efficient way to find out what else is pointing to the same file. We'd need to be able to find linked copies when we want to remove a package, so that the 'linked' versions get cleaned up at package removal time too.

In order to address that, we use another NTFS feature - [alternate streams](http://msdn.microsoft.com/en-us/library/Aa364404). This lets us store a little bit of information with the file itself-in this case, we'll store the other known locations that are linked to the file-so that when we go to remove the 'official' version, we can clean up all the symlinked copies too.