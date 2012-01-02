---
layout: 'article'
title: 'Pushing patches back to CoApp website'
version: '1.0'
docid: "developer:pushpatches"
---

## Requirements:
You need to make sure that you've [forked and checked out the CoApp website][developer:checkoutwebsite], and you've [modified the website content][developer:modifywebsite].

### Pushing changes to your fork

So, you've modified the website and you've locally committed these modifications to your fork of the CoApp website source code:

``` bat
c:\project\>cd coapp.org
c:\project\coapp.org\>git commit -m "Updated developers.html with..." src\dynamic\pages\developers.html.md.ejs
```

It is a good idea to get recent updates from the project upstream:

``` bat
c:\project\coapp.org\>git fetch upstream
c:\project\coapp.org\>git merge upstream/master
```

Typically, you want to push all the updates to your fork of the CoApp website project at GitHub:

``` bat
c:\project\coapp.org\>git push origin master
```

Now, you have pushed your changes to your fork of the CoApp website repository (upstream).

### Submitting your changes to the upstream

As you've learned by the way of [forking and checking out the CoApp website][developer:checkoutwebsite], collaborative development of the CoApp project is based on the Fork + Pull Model defined by GitHub.

In order to contribute your modifications to the mainstream, you need to generate and send pull request to the CoApp website team.

Simply, follow the [Send pull requests]((http://help.github.com/send-pull-requests/) guide at GitHub.