---
layout: 'article'
title: 'Filing bugs for CoApp on GitHub'
version: '1.0'
docid: "developer:fillingbugs"
---

## Requirements:

You'll need the following in order to submit bug reports to CoApp:

- **GitHub account**
- optionally, if you want to create and submit patches too, you will need to set up **Git** in your environment.

For both requirements, refer to [Getting setup with Git and GitHub](/developers/git.html).

### CoApp uses GitHub Issue Tracker

[CoApp project](https://github.com/coapp/) is hosted at [GitHub](http://github.com) and uses [GitHub Issue Tracker](https://github.com/blog/411-github-issue-tracker) to deal with issues related to [CoApp tools](https://github.com/coapp/coapp) or [CoApp website and documentation](https://github.com/coapp/coapp.org).

CoApp Packages also use GitHub to manage issues. Issues for packages are discussed in separate article on [Filing bugs for CoApp package on GitHub](/developers/filing-package-bugs.html).

On GitHub blog, there is an excellent overview of [anatomy of an issue](https://github.com/blog/831-issues-2-0-the-next-generation) posted. Please, refer to this article to learn more about how to use the GitHub Issue Tracker.

### Submitting bug reports for CoApp on GitHub

If you have found a bug and you want to report it, choose one of the following trackers depending on where the bug occurred:

- [CoApp Issues](https://github.com/coapp/coapp/issues) for CoApp core tools project
- [CoApp.org Issues](https://github.com/coapp/coapp.org/issues) for CoApp website and documentation project

<span class="label notice">Notice</span> All trackers hosted at GitHub offer unified interface and work in exactly the same way.

Once you have decided where to submit bug report, go to the corresponding **Issues** page and follow the following steps:

1. Click <span class="label">New Issue</span> button
2. <span class="label important">Important</span> Enter short but descriptive **title**. It allows to easily identify what the bug report is about.
3. Fill the **description** box explaining a few import details:
  * What is the problem - what is happening?
  * What is the expected behaviour - what should be happening?
  * <span class="label important">Important</span> What steps are necessary to reproduce the problem? It is essential to sort out the problem quickly.
  * What is CoApp version you are using?
  * What is Windows OS version?
4. <span class="label important">Important</span> We recommend to **format** the description using [GitHub Flavoured Markdown](http://github.github.com/github-flavored-markdown/) syntax. This makes the bug report clear and readable, especially if you want to include blocks with source code and command line output or auto-link to GitHub references like commits (SHA1) or other issues.
5. If you want to **attach** a patch, `git diff` output or a very long log file, use [Gist](https://gist.github.com/) service:
  * Paste your content
  * It is a good idea to fill **Gist description** and **name the file**
  * <span class="label important">Important</span> Click **Create Public Gist**
  * Then copy and paste URL of your Gist into the issue description.
