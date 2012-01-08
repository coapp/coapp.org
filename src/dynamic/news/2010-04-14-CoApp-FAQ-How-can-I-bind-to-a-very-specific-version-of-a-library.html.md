---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp FAQ - How can I bind to a very specific version of a library?
tags: ['developer', 'coding', 'faq']
docid: "news:20100414faq"
---

(cross-posted to the [mailing list][developer:mailinglist])

We had a discussion on the mailing list about maintaining a Symlink to the most recent version of a particular library, and this was of some concern.

The installation directory (where libraries and their associated files) are installed has absolutely zero effect on binding choices for picking up the actual DLL used for a particular shared library.  The directory layout is actually a convenience for a **developer** who wishes to simply use the latest, CoApp packaged version.

Shared library binding is handled by WinSXS, where a developer chooses a particular version of a library to bind to. So, for example let's say that you want to compile up Python with OpenSSL 0.98h . You can specifically choose the path for the import library by including the version, and you are bound to that version. Now, there is one slight caveat.

WinSXS allows a publisher of a shared library to set the policy of the shared library so that if they put in a bug fix, but do alter the binary interface (ABI) then at run time, the application picks up the latest ("Most recommended") *binary compatible* version of the library.

This means that you bind Python to OpenSSL 0.98h. A bug is found, the publisher of OpenSSL releases 0.98k, and since the ABI hasn't changed, the major & minor versions haven't changed [0][98], just the revision [k]. So once the new library is installed, Python will use it.

## This is the behavior we want

However, when OpenSSL 0.99a ships, by virtue of having the minor # changed [98]->[99] the policy should not forward use on to the new version, and Python would continue to use 0.98k.

This is extremely important, because when we're using shared libraries, it's the author's/publisher's  responsibility to provide security and bug-fix updates in a binary compatible way, and it's the consumer's responsibility to use the libraries in a consistent fashion so we preserve that intent.

Yes, this relinquishes control from the consumer to the publisher, but that is a better balance anyway.

So, if you really really really need to bind to a very specific version, and you are dead set against preserving the shared library model, while it is possible to force bind dynamically to a specific version, what you are really wanting is to be statically bound.

Lemme say that again:

> If you don't' intend to work with shared libraries in the prescribed way, you really
> want to be statically bound, and should select the foo_a.lib. You will actually gain
> additional performance, and will still be able to work in-process with other
> applications using the dynamic library version without collision.

Shared libraries need to be used in a shared-responsibility fashion.

<span class="label important">Important</span> Hey, rather than commenting here, come join [mailing list][developer:mailinglist], join the team at [IRC][developer:irc] and continue the conversation!