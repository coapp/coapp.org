---
layout: post
author: Garrett Serack 
twitter: fearthecowboy
title: How Does CoApp Handle Dependencies?
docid: "news:20120110faq"
tags: ['design']
---
Recently, on the mailing list, Mateusz Loskot [asked the question](https://lists.launchpad.net/coapp-developers/msg01234.html):
 
> Perhaps it has been discussed and solution's already established,
> but I'm wondering how CoApp is going to solve dependencies between
> packages?

Well, get your pencils ready kids, 'cause I'm about to drop the knowledge hammer down.

CoApp (over the longer term) handles dependencies in two ways:

**Fixed** dependencies and **Flexible** dependencies. Fixed dependencies are specific bindings to another package (Package `B-1.0.0.0-x86-AAAABBBBCCCCDDDD` requires Package `A-1.0.0.0-x86-DDDDEEEEFFFF1111`). Flexible dependencies are far more fluid, and simply state that "this package requires any package that satisfies `feature-XYZ` with a version matching range `NNNN`".

**Fixed** dependencies are tied very tightly to how Windows' [Side-by-Side][news:20100415faq] technology works.  Each package has a `name` (e.g. `B`), `version` (e.g `1.0.0.0`), `platform architecture` (e.g. `x86`), and a `public-key-token` (e.g. `AAAABBBBCCCCDDDD`, which is calculated from the hash of the signing key of the package-publisher's certificate).  These create somewhat rigid requirements of other packages, where the only flexibility is that the publisher of a package can specify that a newer version of a package is [**binary-compatible**](http://en.wikipedia.org/wiki/Application_binary_interface) with an older version, and should be used instead. In Windows, the binary-compatibility expressed by packages is called the *publisher-policy*. 

In CoApp, we refer to this as the **compatibility-policy**. When a package asks for a version of a package, the package manager looks for the highest version of the package that satisfies the dependency, given the compatibility-policy. For example if a package binds to `zlib-1.2.0.0-x86-AAAABBBBCCCCDD` , and the highest binary-compatible package is `zlib-1.2.7.11-AAAABBBBCCCCDDDD` , CoApp will attempt to install the later package.  This does seem to place a great deal of trust in the publisher of a given package--but really, if you're trusting them by making a dependency on them, you should be trusting them to make sure that they are not breaking binary compatibility when they say they are not. Conversely, publishers should be *extremely careful not to break binary compatibility when publishing updates*. 

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Things your OS never told you about version numbers|
||You may have noticed that CoApp version numbers are always represented as a four 16-bit positive integers, containing **[major-version].[minor-version].[build-number].[revision]**. For example, version 1.5.1254.0 indicates 1 as the major version number, 5 as the minor version number, 1254 as the build number and 0 as the revision number.  Windows Side-by-Side technology (and it's sibling, .NET assemblies) **requires** this standard for versioning everything.  <br/><br/> When Side-by-side is asked to find an assembly of a given version, it first looks at just the **[major-version].[minor-version]** of the assembly, and checks to see if there is a publisher-policy for that version combination. If there are any policies found (as [there can be several](msdn.microsoft.com/en-us/library/ms973843.aspx)), it then checks the version ranges in the policy to see if the requested version has been redirected to a new one.<br/><br/> From this behavior, you can infer that the designers of SxS generally intended that binary-compatible libraries would be constrained to the same major/minor versions, as you'd have to explicitly create a policy for every major/minor version that you wish to redirect (which is possible, but not encouraged).  Those of us in the real world realize that controlling these numbers is not always as easy as that, so CoApp tries to make building policies bridging major/minor versions easier, and hides the details. |
|||

When the package manager resolves the dependency tree where all the dependencies are `Fixed`, it does so in a predictable, fault-tolerant way.  By examining the publisher policies, it works it's way back from the **most appropriate** version down to the **least appropriate** version. The most appropriate is the highest version that has a compatibility-policy that covers the given version, and where that package's entire dependency tree can be satisfied. If a failure happens during the downloading of the dependencies, or during the installation of one of the dependencies, that package gets marked as *unable to be fulfilled* for that installation session, and the package manager starts back at the top, and tries to identify the best package that can be fulfilled. This form of dependency resolution is always straightforward and doesn't require any special judgement or decision making ability, since every installable package has a very explicit expectation of what it requires.

Some fundamental difference between CoApp and package management resolution systems found on other platforms:

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;||
||CoApp packages *never* collide. Each and every package can be installed side-by-side with each other, and while one may be 'active' for purposes of a given configuration, the presence of another version of the same package can never result in the failure of it's sibling.|
||CoApp packages are always [**strong named**](http://msdn.microsoft.com/en-us/library/wd40t7ad.aspx). With the `name`, `version`, `platform architecture` and `public-key-token`, no package can be poisoned/broken by installing a package from another publisher.|
||With no possibility of package collision or conflicts, we have no need to support negative conditions on package dependencies (ie, install `A` & `B` unless `C` is installed.) This removes an order of complexity in package resolution.|

We also have the ability to place markers on packages that affect resolution in a few ways:

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Markers|
||`Requested` packages are packages that the user explicitly asked for. For example, I wanted to use OpenSSL-1.0.0.0 and it brought in zlib-1.2.5.0. OpenSSL is a requested package, zlib is not. When upgrading, a requested package can be upgraded to a newer version that may not be binary compatible (since you don't have a binary dependency you're breaking with installing a new one)|
||`Required` packages are packages that are the result of a dependency resolution. In the previous example, zlib is a required  package. These can be automatically be upgraded to a newer, binary-compatible package.|
||`Frozen` packages are ones that the user has specifically stated that it is not to be upgraded, for whatever reason|
||`Blocked` packages are ones that the user has specifically stated that it is not to be installed, for whatever reason|

**Flexible** dependencies on the other hand, are not yet implemented in CoApp, so even this definition is somewhat fluid. Generally, we're looking to make sure that we can have packages that simply state things like *"I need any version of a python interpreter"*, or *"I need a version of Java greater than Java 5"* .  Exactly how these are specified is still a topic for discussion, and I'm eagerly accepting ideas and feedback for how this plays out.

This is where it's going to get a little bit dicey, and we're going to have to build a set of rules to determine the most appropriate course of action.  

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Questions about happy package resolution|
||When two packages can satisfy a Flexible dependency, and you have neither installed, how do you choose which one to install? This ranges from the very trivial `"I need any version of grep"` to `"I need a version of python 3.2+"` <br/><br/>What criteria can we use to satisfy these dependencies (especially when the publisher has absolutely no preference) |
||CoApp prides itself (in the default case) of never requiring the user to make decisions for package satisfaction. Do we want to make it so that advanced users can be asked to choose a course for Flexible package resolution? |
||How do we set--or more appropriately, allow communities to--set standards for determining if a given package actually fulfills a given 'feature', and when in the event a package is found to not be adequately fulfilling a feature, how does the community push that feedback back to others? <br/><br/>Does this mean that a publisher should be able to say `"I want any Perl 5 implementation, but not *Cheesy-Perl*"` ? If so, what happens when we need to install a second Perl, just because a publisher didn't want or can't use the currently available one? Does that replace the 'active' installed Perl?  |
|||

I've looked at resolver algorithms like [Libzypp](http://en.opensuse.org/openSUSE:Libzypp_satsolver_basics) and the [general theories](http://en.wikipedia.org/wiki/Boolean_satisfiability_problem) on the subject, and they appear to solve issues that our philosophical boundaries generally eliminate (XOR and negative conditions are unnecessary). 

The only other random thought I've had is that there may be cases where a dependency tree is already installed for a less-than-most-appropriate dependency tree, but the package manager would try to update as much as it can.  To me, this sounds like the packages are due for an update, but for whatever reason the user hasn't updated them. Should the package manager simply accept the given resolved dependency tree without additional installs, if possible?


