---
layout: 'article'
title: 'Shallow-Forking'
version: 1.0
---
### Forking prerequisites:
* [CoApp Toolkit][Toolkit] and [Devtools][Devtools] must be installed
* A git client (such as msys-git) must be installed
* [WiX 3.6][WIX] (or higher) must be installed
* A code-signing certificate (typically a .pfx file) will be required.  [A self-signed certificate is fine][Certs].

If you have not already set up a default signing certificate for SimpleSigner, it is suggested that you do that now with the following command:
``` text
simplesigner --certificate-path=<path_to_pfx_file> --remember
```
You will be prompted for the certificate password, and will then receive an error about missing files.  Ignore the error.  From now on, unless you explicitly specify a different signing certificate, SimpleSigner will use the certificate you just saved to perform any code signing.

-------
### Contents:

* __Making a new fork__
    * [Github-based fork](#new-github)
    * [Other Git-based fork](#new-git)
    * [New fork from snapshot](#new-snapshot)
* __Updating forks__
    * [Github-based update](#update-github)
    * [Other Git-based update](#update-git)
    * [Update fork from snapshot](#update-snapshot)

-------

## Making a new fork
#### [](!new-github)Github-based Fork:
1) Perform a github fork to the CoApp-Packages organization
2) Clone the newly forked repository
3) Create a branch named `upstream` from latest **stable** release
``` text
git checkout -b upstream refs/tags/<tag_name>
```
4) Create a branch named `CoApp` from `upstream`
``` text
git checkout -b CoApp
```
5) Add COPKG dir and make any necessary changes to allow building via ptk
- See [Packaging best practices][Packaging]

6) Commit changes
7) Push to CoApp-Packages
``` text
git push origin upstream
git push origin CoApp
```
8) Optional (but recommended):
- On Github, set the "Default Branch" for the newly forked and pushed repo to `CoApp`

#### [](!new-git)Other Git-based Fork:
1) On Github, create a new repo in CoApp-Packages for the new fork
2) Clone source repository to your local computer
3) Rename the existing remote and add the Github repo (created in step 1) as a remote
``` text
git remote rename origin top
git remote add origin <github_repo_url>
```
4) Create a branch named `upstream` from latest **stable** release
``` text
git checkout -b upstream refs/tags/<tag_name>
```
5) Create a branch named `CoApp` from `upstream`
``` text
git checkout -b CoApp
```
6) Add COPKG dir and make any necessary changes to allow building via ptk
- See [Packaging best practices][Packaging]

7) Commit changes
8) Push to CoApp-Packages
``` text
git push origin upstream
git push origin CoApp
```
9) Optional (but recommended):
- On Github, set the "Default Branch" for the newly forked and pushed repo to `CoApp`

#### [](!new-snapshot)New fork from snapshot:
1) On Github, create a new repo in CoApp-Packages for the new fork
2) Download and unpack/unzip/untar the snapshot to a convenient location (such as C:\repo\MyRepo)
3) Initialize that location as a new git repository
``` text
cd <repo_dir>
git init
git add .
git commit -m "Initial commit"
git branch -m master upstream
```
4) Tag the repo with the current version of the forked software
``` text
git tag SomeSoftware-1.2.3
```
5) Add the Github repo (created in step 1) as a remote
``` text
git remote add origin <github_repo_url>
```
6) Create a branch named `CoApp` from `upstream`
``` text
git checkout -b CoApp
```
7) Add COPKG dir and make any necessary changes to allow building via ptk
- See [Packaging best practices][Packaging]

8) Commit changes
9) Push to CoApp-Packages
``` text
git push --all -u origin
git push --tags
```
10) Optional (but recommended):
- On Github, set the "Default Branch" for the newly forked and pushed repo to `CoApp`
    
## Updating forks
#### [](!update-github)Update a fork made from Github:
1) Clone/pull the repo from CoApp-Packages
2) Add the original source repo as a remote 
``` text
git remote add top <original_github_source_url>
git fetch -t top
```
3) Make sure that the current branch is `upstream`
``` text
git checkout upstream
```
4) Apply/merge latest stable tag/branch
``` text
git merge --ff-only <tag/branch>
```
5) Change current branch to `CoApp`
``` text
git checkout CoApp
```
6) Merge changes from `upstream`
``` text
git merge upstream
```
7) Make any necessary adjustments to continue building with CoApp
8) Commit changes (if any)
9) Push to CoApp-Packages
``` text
git push --tags --all origin
```

#### [](!update-git)Update a made from a non-Github git repo:
1) Clone the repo from CoApp-Packages
2) Add the original source repo as a remote 
``` text
git remote add top <git_source_url>
git fetch -t top
```
3) Make sure that the current branch is `upstream`
``` text
git checkout upstream
```
4) Apply/merge latest stable tag/branch
``` text
git merge --ff-only <tag/branch>
```
5) Make sure that the current branch is `CoApp`
``` text
git checkout CoApp
```
6) Merge changes from `upstream`
``` text
git merge upstream
```
7) Make any necessary adjustments to continue building with CoApp
8) Commit changes (if any)
9) Push to CoApp-Packages
``` text
git push --tags --all origin
```

#### [](!update-snapshot)Update a fork from a snapshot:
1) Clone the repo from CoApp-Packages
2) Make sure that the current branch is `upstream`
``` text
git checkout upstream
```
3) Clear workspace for new snapshot
``` text
del *
for /d %d in (*) do rd /s /q %d
git rm . -r
```
4) Download and unpack/unzip/untar the new snapshot into the workspace.
5) Commit and push the new snapshot
``` text
git add .
git commit -a -m "Import snapshot of SomeSoftware, version 2.0.1"
git tag SomeSoftware-2.0.1
git push origin upstream
git push --tags
```
6) Switch to branch `CoApp`
``` text
git checkout CoApp
```
7) Merge changes from `upstream`
``` text
git merge upstream
```
8) Make any necessary adjustments to continue building with CoApp
9) Commit changes (if any)
10) Push to CoApp-Packages
``` text
git push origin CoApp
```

[Toolkit]: <http://coapp.org/install>
[Devtools]: <http://coapp.org/devtools>
[WIX]: <http://wix.codeplex.com/releases/view/85409>
[Packaging]: </developers/packagingbestpractices.html>
[Certs]: </developers/self-signed-certs.html>
