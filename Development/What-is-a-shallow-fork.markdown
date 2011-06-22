---
layout: development
subtitle: Shallow Forking
---

### What is a shallow fork

A [fork](http://bit.ly/lGYOb6) happens when developers take a copy of source code from one software package and starts independent development on it, creating a distinct piece of software.  A shallow-fork is when the independent development continually brings forward changes from the original project, and attempts not to stray very far from it.  We do this so that we can make appropriate Windows changes (like new build scripts, or better API support) keep compatibility and not break the original project.  If the upstream project is willing to accept changes, great! If not (for whatever reason)... great! Either way, the package maintainer for the CoApp project will aim to keep the projects in sync as much as possible. 

Linux distributions do this sort of thing all the time, in order to build packages for their specific version of Linux.  We're essentially following in the same footsteps, but following the procedure that I'm setting out here, so that we can eventually produce packages of software for CoApp.

(test)