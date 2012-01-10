---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: Simulating Symlinks for Windows XP/2003
tags: ['developer']
docid: "news:20110407"
---

(cross-posted to the [mailing list][developer:mailinglist])

As I mentioned in my last post, CoApp's design [relies heavily][news:20110404] on the use of [Symbolic Links](http://en.wikipedia.org/wiki/Symlinks) (symlinks)-a feature which is implemented fairly well in Windows Vista and beyond, but is missing in earlier versions of Windows.

Cygwin tried to work around the limitation by using shortcuts (.LNK files), which are files used by the Windows Shell for all the shortcuts in the start menu.  Not a bad way to go, but unfortunately, not very compatible with a lot of things, since most programs don't specially recognize .LNK files, although the POSIX emulation in cygwin did.

I was thinkin' that any acceptable solution should work with as much software as possible, without requiring special understanding, nor should any additional software be required (ie, a filter driver of some sort).

Our options then, are somewhat limited. On Windows XP and Windows Server 2003 we **do** have features like junctions (like symlinks, but only for directories, and only on the same volume), hard links (where more than one directory entry points to the same physical file) and alternate streams (the ability to store extra data with a file).

Hmmm.

Junctions seem to work fairly well for directories, with the caveat that actually manipulating junctions requires some tricky code with DeviceIOControl calls.

For file symlinks, I've used NTFS hardlinks, but when I create the link, I store some additional metadata with the file itself in an alternate stream (under the name "legacySymlinkInfo") which allows tools to find out what the canonical filename really is, and also to find out what other files are linked to the same physical file.

Of course, non-CoApp software could still manipulate these files for little regard as to their status as 'symlinks', so the legacySymlinkInfo really can't always be relied upon. But we can make a pretty good effort to 'clean-as-we-go' to keep that information up-to-date. If a file gets renamed or moved, the metadata may not be entirely accurate, so when we check the data, we make an attempt to validate that it is accurate, and update it with what we know. If it sounds like this is dodgy, I wouldn't disagree, but in practice this seems to work really well.

Lastly, we need to be able to redirect a symlink, even when it is in use.  This seems trivial enough to do with junctions, but with files, we have to resort to moving the file out of the way, and creating a new linked file (which we can do, even if the file locked).

Admittedly, there are a few limitations that this design has:

* Symlinks are only supported on the local system (no cross volume links, nor can they link to UNC paths)
* Symlinks must be absolute references (not linking to relative paths)
* The relationship between the linked file and the canonical file is potentially ephemeral, but simple examination of the files allows us to rebuild the information.
* In the worst case scenario, if files get unlinked, they still work as regular files.

Luckily, CoApp's requirements for what symbolic links need to do doesn't have to be as flexible as full blown symlinks, and these limitations are not a hindrance at all.

I've just added this code to the CoApp toolkit (written in C#), and I'll be playing with it quite a bit over the next few weeks. Once I'm sure that everything works as I like, if there is interest, I may implement a pure native version of the code so that other utilities and software can do the same thing and play nice too.