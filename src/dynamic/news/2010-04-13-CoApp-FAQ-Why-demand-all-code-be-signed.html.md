---
layout: post
author: Garrett Serack
twitter: fearthecowboy
title: CoApp FAQ - Why demand all code be signed?
tags: ['developer', 'coding', 'signing', 'faq']
docid: "news:20100413faq"
---

(cross-posted to the [mailing list][developer:mailinglist])

I'm answering this in a one-off manner a little too often, so I'll dump it all here.

## Q: What is Code Signing?

A: For the long-winded answer, check out Wikipedia's article on [Code Signing](http://en.wikipedia.org/wiki/Code_signing). All that aside, it's a way of attaching a cryptographic signature to a binary (EXE, DLL, etc) that allows anyone validate what organization compiled the code, when it was compiled, and that it hasn't been tampered since it was signed.  The certificate must be issued from a Certificate Authority-pretty much the same gang of folks who churn out SSL certificates. Similar benefits are often accomplished in the Linux world by a couple of cryptographic operations: An MD5 hash, which someone can verify that a binary has not been tampered with, and less commonly, PGP/GPG signatures for files.

## Q: What are the requirements to signing code?

A: Signing code itself (on Windows) is pretty easy using the *signtool* that comes in the Windows SDK...provided you have a certificate. To get a certificate, you can either generate a certificate yourself (often called self-issued or self-signed) or you can get one from a reputable CA. The CA will validate that you are who you claim to be (by whatever methods they deem necessary) before issuing the certificate. The certificate is good for a fixed period (typically for a year) and can be renewed. When you sign a binary with the signtool, it can use a time server to validate that the binary was signed when the certificate was still valid, and the binary won't expire when the certificate expires.  In the event of malice or loss-of-possession of a certificate, the CA can revoke the certificate by adding it to a Certificate Revocation List (CRL).

## Q: What benefits will this provide?

A: Signed code will allow us as users to identify who is responsible for a particular binary or package. It also lets us uniquely identify a binary regardless of name-two publishers can create the same binary, but they would sign it with different certificates, thereby providing us a way of selecting one over another.

## Q: Does this completely halt malware?

A: It should slam the doors pretty damn tight. Anonymity is how malware gets around, either by corrupting an unsigned binary in the first place, or by shipping software that isn't signed and having an end user execute it.  Signed binaries don't allow malware operators the pleasure of hiding behind the fact nobody knows who they are, and if they did acquire a certificate fraudulently and signed a binary, the certificate can be revoked, prohibiting the binaries issued from validating.

## Q: But, I can't afford a code signing certificate!

A: I'm committed to making sure that cost is not a blocker for code-signing open source applications. I've identified a few avenues that this can happen, some of which I'm investigating right now.

## Q: Why can't I simply use a self-signed/self-issued certificate?

A: While we could validate that the same certificate (and by extension, because a persons possesses the signing key, a person) has signed a particular package as another, it doesn't give us a trustable way to identify who that was.  In the same fashion a self issued SSL cert protects against casual man-in-the-middle attacks, it doesn't identify who you are connecting with, and would permit a non-casual man-in-the-middle attack or redirection.

## Q: So who's gonna sign all those apps?

A: [Publishers](/publishers.html) of CoApp-compatible packages will be able to sign them. Anyone who acquires the appropriate certificates can be a publisher. As I've noted elsewhere, Publishers don't have to be the author of the application.  The CoApp project will be one such publisher of Open Source libraries and applications, and will do so for a very wide range of software.

## Q: You're saying CoApp is gonna sign my apps?

A: Sure, provided that it meets all of the requirements for packaging and automation of the build process. We will likely implement a code-validation process where it would have to pass both an automated scan and a manual verification by a peer or peer committee, to avoid any shenanigans. As well, we are confident that other open source organizations like Apache or Eclipse or others will be able to do the same.

## Q: LA LA LA LA LA I'm not listening. Most open source projects can't afford a code signing certificate!

A: Stop that. I've already told you that it will not be an issue. Code Signing is not an option.

## Q: Hey, waitaminute. What about .NET code. Doesn't that Strong Naming stuff obliviate the need for Code Signing with Certificates?

A: Strong naming is not code signing. Although digital signatures are used to generate strong names, strong naming does not use digital certificate, instead it uses self-created digital keys . This means that it is not really possible to establish a chain of trust for the public key; and therefore there is no way to bind the identity of the software publisher to the private key being used to sign the assembly (see the question about self-signing above). Since strong names do not support digital certificates, they do not support expiration or revocation of key material either. It is always recommended that strong names be used along with Authenticode code signing, where possible.

If'n you're still having problems, perhaps you should what my pappy always used to tell me:

> Don't try to understand 'em, Just rope, throw, and brand 'em

Now, it's entirely possible he was talkin' about cattle and not code at the time, but I figure it's good advice at the best of times.

<span class="label important">Important</span> Hey, rather than commenting here, come join [mailing list][developer:mailinglist], join the team at [IRC][developer:irc] and continue the conversation!