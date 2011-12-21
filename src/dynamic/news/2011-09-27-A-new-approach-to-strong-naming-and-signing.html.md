---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: A new approach to strong naming and signing of Windows and .NET binaries
tags: ['developer', 'coding' ,'signing' ]
---
As most people who know me, I'm a huge proponent of digital signing and strong naming of binaries.

**Authenticode digital signing** is where the publisher of a peice of software gets a certificate from a CA (certificate authority) that allows them to attach a cryptographic signature to their binaries.  This **doesn't** tell you that it's safe, but as long as the publisher hasn't lost controlof their private key (and/or the CA hasn't been comprimised), you can be assured that the binary actually came from that publisher.

**.NET Strong Naming** on the other hand, offers up something similar, yet designed for a different purpose.  When a developer strong-names an assembly, consumers of that assembly can link to it and know that when their application runs, it will only run with a copy of that assembly by that publisher, and not merely pick up one that conveniently has the same name.  In strong-naming, there is no CA (and hence, no assertion that the publisher is who they say they are), merely the ability to know that a given binary came from the same publisher as the last one. Oh year,.NET binaries can also be digitally signed, which provides the benefits of both sides of the cryptographic spectrum.

I've said it many times, CoApp is at this point, only supporting signed binaries (and .NET binaries must be strong-named as well.)  There are already a number of cheap/free places that open source projects can acquire code-signing certificates, and we'll be investigating how to cleanly support self-signed (or community-cross-signed) certificates in the future.  

Really, if you are a proponent of Open Source software, you'd really **only** want to run binaries that you haven't personally built if the publisher had digitally signed them, which would at least give you the satisfaction of being able to track down the publisher of a given binary.

#### Using Code Signing and Strong Naming

So that being said, there are a couple of things about Digital Signing that have irked me for a very long time.

First, code signing is a pain-in-the-backside.  The tools, documentation, compilers, etc seem to all be built by people who really didn't know how developers work in the real world, and/or by people who thought that having a really compilcated command line process was better than just doing the right thing in a simple, straightforward manner.  The process for code signing should be as simple as :


``` c#
   BINARY + (CERTIFICATE + PASSWORD) => Signed Binary 
```

What more do you **really** want to know about signing? Any more complicated than that, and you're losing developers. Which means that customers are losing too.

The second thing that irks me, is that **strong-naming** is even more of a pain-in-the-backside.  Not only is the process locked up in a single painful tool (sn.exe), the developers of .NET seem to have gone out of their way to explain it in such a way that makes sure everyone is just doing it all by rote. Worse, you have to make huge changes your development practice to support strong naming.

Because the assembly needs to be written to disk with the embedded signature, you have to either 

(a) give all your developers access to your strong-name-private-key (which is downright stupid--that sort of thing should be kept under extremely tight control, and the release manager/project leaders should be the only ones with access)

(b) split out the public key, and use that during development (using what is called 'delay-signing'). Delay signing embeds the public key, and leaves space in the binary for the cryptographic hash, but  doesn't actually fill it in. Of course, then the binaries aren't *really* signed, and you have to turn off signature verification on the developer's machines which makes it so no .NET binaries are checking for signatures (oh, you can do it per-binary. WHAT A PAIN!). Anyone who has every worked under these conditions knows that this sucks so bad, that you don't want to do it. There is a third option-- .NET has an assembly attribute you can use to specify the strong-named public key, and you could use a compiler `#define` to only strong name it when you want to build the release version:

``` c#
#if SIGN_ASSEMBLY 
    [assembly: AssemblyKeyFileAttribute("path\\to\\release-public-key.snk")]
    [assembly: AssemblyDelaySignAttribute(true)]
#endif 
```

That's what I was doing with CoApp for a long time. Oh, yeah, they depricated that.  So there *isn't* an approved, non-deprecated way to only strong-name during release. On top of that, only I could build the release version,and I **still** had to contend with the final boneheaded part  of the whole equation:

**SN.EXE WON"T LET YOU PASS THE PASSWORD TO THE KEYPAIR ON THE COMMAND LINE**

There isn't a command line argument for it, it stops and prompts for it. Oh, and the binary checks to see if you are redirecting stdin and doesn't even let you do that.

I'm sorry, I know that some well-meaning PM thought that this was a good idea, but if I want to make the decision to automate my development process by putting the password to my certificate or strong-named **IT'S MY DECISION, NOT YOURS!**

>> **I've got an extremely long and complicated password on my machines. I've got a screen-saver lock that engages after a couple minutes. I've got Bitlocker on my drive. I don't need another layer  of pseudo-security pretending to 'help' ... **

>> By the way, yes I do know that you can have sn.exe manage the keypair for you, but you'll get pretty dissatisfied with that too.

So, here we sit with essentially a very valuable concept, wrapped in irksome developer tools, and a flawed process. Final Verdict: EVERYONE HATES TO DO STRONG NAMING.

#### So, I fixed all that. 

CoApp's *simplesigner* tool (and, by extension, *autopackage*) can now strong name and sign **ANY .NET binary** without having to resort to any goofiness.  It can rewrite assembly attributes on the fly, and insert a new strong name for .NET assebmlies, as well as generate and embed and digital signatures for native and .NET binaries with a single command.  You can leave the certificate in a .pfx fileand it will use the same keypair for signing and strong naming. you can pass the password on the  command line, or have it remember it in an encrypted setting in the user's registry (which can only be decrypted when that user is logged in, and can't be recovered if the user's password is forcibly changed)

It doesn't use command line tools behind the scenes to do its work (a solution I had cobbled together before) nor does it use such things as ILMerge (which was one way to sneak in a new strong name after the fact)

#### Example usage:

@[Running simplesigner on an EXE](/images/blog/simplesigner.png)

Pretty easy, eh? Notice that it also signed and strong-named the dependent Assemblies. If you wanted to use a different public key, you could just do that beforehand.

We can also check PEVerify to ensure that the updated files are all happy-as-a-clam .NET EXEs:

@[Running PEVerify on the result](/images/blog/verified.png)

And of course, you can see the EXE is digitally signed:

@[Verifying that it's signed](/images/blog/DigitallySigned.png)

#### How did I accomplish this strange dark magic? 

Tons of research into the public APIs for digital signing and strong naming (yeah, everything I've done, is documented **somewhere** ... ) and levereaged the [cci-metadata project](http://ccimetadata.codeplex.com/) from Microsoft Research on codeplex.

CCI-Metadata lets you manipulate .NET binaries, which I used to add in the strong name public key, and after persisting it back to disk, I was able to use the MSCOREE apis to apply the strong-name itself.

I'll see about doing a deep-dive into the code soon. When CoApp Beta 2 is posted in a couple weeks, the simplesigner tool will be there, and you'll be able to just grab that binary and use it foryour own codesigning and strong-naming work.

