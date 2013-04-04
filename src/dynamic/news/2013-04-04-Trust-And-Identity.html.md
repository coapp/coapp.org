---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: Trust, Identity and Stuff (uh, packages).
docid: "news:20130404"
tags: ['news']
---

A few weeks back, Phil Haack wrote blogged about ["Trust and Nuget"](http://haacked.com/archive/2013/02/19/trust-and-nuget.aspx) in which he brings to light the terribly complex issues with how to know when to trust a given package or not.

Having spent a sizeable amount of my career working in the digital identity ecosystem, I feel like I've got more than a couple of ideas to throw at the problem, and I think that first thing to do is ensure that we're trying to solve the right problem.

Phil is fairly correct in asserting the means by which we implicitly (or explicitly) decide if a particular peice of code is worth trusting. Let's pivot a bit on his criteria, and see if we can't flesh it out a bit.

<br/>
### Identity
First, Phil asks the question **"Who is the author?"** - this would of course, appear to be the real central concept that we're basing our decisions off of. Well--sortof. We really care about who is the publisher of a particular piece of software for really only a few reasons. 

Up front, is to be able to make a valid 'trust' decision--the idea of to what degree to trust that particular piece of software. Let's come back to that one in a moment.

The other half of the identity question boils down to blame or recourse. If something does go wrong, exactly who can I point the finger at, and what can be done about it?<br/> 
Hmmm. That's a loaded question. Generally, in the opensource ecosystem, software is nearly always left without warrantee, so if there is simply a bug or failing in the software, I'd at least like to contact the author to get them to fix it.
Now, if there is malignant intent buried in there, we'd sure love to be able to smack someone around (figuratively!), or at the very least stop them from further distributing their smelly pile of manure.

But basically, Identity is mostly used as a *factor* in our calculations for determining whether we want to actually run that software. But *how* do we use it as a factor?
<p class="alert-message block-message info"><i><b>Dispelling a myth: Isn't Identity established with a Certificate?</b></i><br><br>
<b>Certificate Authorities (CAs)</b> would have you believe that it does but in reality, the use of 'certificates' (ie, code-signing certificates and SSL certificates) just combines a couple things: <br/>
<br/>&nbsp;&nbsp;&nbsp;- <b>Public-key cryptography</b> -- the ability to digitally sign and verify that given message was produced by the holder of the private key. <br/>
<br/>&nbsp;&nbsp;&nbsp;- <b>An assertion of claims</b> by one holder (the CA) of a private key about another (the 'Subject' -- either an organization or a person).
<br/><br/>So the certificate contains a bunch of properties--assertions by the CA, about the Subject--plus the public-key of the Subject, so that when the Subject signs something else, we can mathematically validate the message can only have come from that Subject.
<br/><br/>Uh, <B>why</B> exactly would we trust the assertions of the CA? Who died and made them the king of everything? Well, In Windows, Microsoft includes the 'Root' certificates from a bunch of CAs that have a well-documented and verified process that they use to validate other's identities. In essence, you're trusting Microsoft to validate the CAs and therefore are trusting the CAs to validate others.  
<br/><br/>Which means that by virtue of validating the signatures of a bunch certificates, we're virtually establishing the identity of a person or organization, and generally, this is all we've ever been given as a deciding factor in 'trusting' someone.
</p>


### Trust?
**Trust** is the word that a lot of people throw around, like there is some universal truth of trustworthiness, when really trust is a very personal decision, and subject to change one way or another depending on context and opportunity. 

Anyway, getting back to the idea of *"to what degree to trust that particular piece of software?"* ... let's break this down into a few more questions:
<br/>
##### "Can I run this piece of software safely" (probably the most important)
Highest on my list, it's easy to see that I'd rather not even touch something that was intending on stealing my data, or compromising my security.  I'm assuming that Phil was refering to this when he asked **"Is the author trustworthy?"**
<br/>
##### "Is this the actual software that I'm looking for" 
This looks to establish the actual *pedigree* of the software, and is asserted by Phil's third question **"Do I trust that this software really was written by the author?"**  If you know that a given piece of software is given to you by Microsoft or IBM or Intel, it means an awful lot more than if it comes from "FlyByNightCrapware, Inc."
<br/>
##### "Will this software perform to the level that I need"
This is partially related to the previous one, but is a feeling of quality -- Even if the software is safe to use, will it do what I need it to? Should I even bother?
<br/>

Perhaps we should think of 'trust' the same way that we think of the velocity of a car--it really only has significant meaning at a given point in time (where and when we examine it), and examining it after the fact only tells us the state at that given point.

If we think of the *Context* of a particular use as :    

    Context = WhereImUsingIt + WhenImUsingIt + WhatImUsingItFor 

and *Trust* could be:

    Trust = Context * Reputation 
    
Then to determine trustworthiness, the only thing we have to figure out is-- what is the **Reputation** of the publisher. 

### Ah, Reputation 

Phil makes some excellent points regarding how he establishes the *reputation* of a given publisher--associating accounts from many services (GitHub, Twitter, etc) and making a value judgment there. 

Unfortunately this is a manual process, and engineering an automated system that isn't able to be gamed is extremely difficult to pull off.

And he's right, we need to piggy-back on another verification system.

<br/>
### <center>It turns out that Digital Signing is the right answer.</center>
<br/>

What!? Didn't he say that it's not? 

Yeah, but before we attempt to refute his reasons for saying that, let's see what Digital Signing does get us:
<br/>
#### A method of using public-key cryptography to sign stuff
Virtually **everything** that we need to be able to verify (EXEs, DLLs, MSIs, Zip files, .nupkg files, PowerShell Scripts, etc) are directly able to be digitally signed and validated with existing tools. No new technology is needed. No special environments. It's all there, we've just been ignoring it for a long time.

<br/>
#### A method for establishing an Identity (but not reputation)
Even though someone's **Identity** isn't their **Reputation** , we still require that someone assert *who* they are before we can make judgments about if we trust their code. At the very least it gives us the opportunity to find them, and go from there.  
<br/>
But even if it didn't it at least gives us the **ability to determine that a given version of a package is produced by the same person that produced the last one**.  Even if I don't know who Bob Smith is, if I have package signed by him, and he issues an newer one, I can easily verify that it is from the same person, so I'm welcome to trust it as much as the one he issued before.  

### So, about those problems?

Ah, righty-so... There are a couple little gotchas, but nothing that can't be addressed, which at least provides something better than DOING NOTHING AT ALL.

#### The Cost and Ubiquity Problem
Yes, Digital Certificates issued by CAs are expensive. Prohibitively expensive for general adoption. They are OK for organizations that want to shell out a few hundred bucks a year for it, but private individuals are cut out of the game.

<br/>
#### <i>Waitaminute.</i>

*Would it shock you to know that there is a CA that doesn't charge for issuing certificates, and is handled in a method like a Web of Trust?*

<p class="alert-message block-message success"><i><b>A Free Web-of-Trust style CA</b></i> (see <a style="color:blue; text-decoration:underline;" href="http://en.wikipedia.org/wiki/Cacert">Wikipedia article</a>)<br><br>
<b><a style="color:blue; text-decoration:underline;" href="http://CACert.org">CACert.org</a></b> is a is a community-driven certificate authority that issues free public key certificates to the public (unlike other certificate authorities which are commercial and sell certificates). 
These certificates can be used to digitally sign and encrypt email, authenticate and authorize users connecting to websites and secure data transmission over the Internet. Any application that supports the Secure Socket Layer (SSL) can make use of certificates signed by CAcert, as can any application that uses X.509 certificates, e.g. for encryption or code signing and document signatures.
</p>

<br/>
### <i>What's the catch?</i>

The catch is, the root certificates aren't distributed with Windows. That's ok, because they can be easily distributed with the software that needs them (ie, NuGet and/or CoApp) They don't even need to be installed into the Root Certificate Store, we can just have them on hand to verify that a particular certificate was issued off the CACert root cert.

Still, it gets us past the whole cost-as-an-issue problem.

<br/>
#### The User Interface Problem

Oh, Right....So, becuase we don't have adequate UI to ensure that the user can make Reputation judgements for themselves is a reason not to sign packages? 

Isn't that kinda like saying "We don't have cars, so why bother building roads?"  

Shouldn't we start laying the groundwork where we can encourage (and eventually **require**) people to sign their packages, and build the reputation/trust resolution on top of that? The fundemental infrastructure for handling digital signing is pretty damn good. All we have to do is **begin** moving towards a model where we can help the user make the decisions for themselves.

#### TL;DR
- Digital Signing of packages, binaries, etc is very well handled with the tools and infrastructure of X509 Certificates. 
<br/>
- [CACert.org](http://CACert.org) can effectively provide the infrastructure for identifying individuals in a Web-of-Trust model, free of charge.
<br/>
- Implementing Digitial Signing support **today**, puts us on the track for managing trust and reputation in a reliable fashion in the future, without having to "invent" new models at all.

