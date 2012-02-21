---
layout: post
author: Eric Schultz
twitter: wwahammy
title: Preview of CoApp GUI - Part 2
tags: ['gui', 'updater']
docid: "news:20120221"
---
**[Part 1 of CoApp GUI preview](http://coapp.org/news/2012-02-17-Preview-of-CoApp-GUI---Part-1.html)**

Today I'm going to summarize the mockup work I've completed on the general package manager for CoApp. Before I start, it's important to understand a few design decisions and the reasons for them.

During the design of the UI, the general package manager is both a package manager and something more broad, what we call a product manager. As you may recall, a CoApp package is uniquely identified by a name, a processor architecture, a version number and the public key token of the publisher. For certain advanced uses, a user might need this information but for most uses a user just wants a particular piece of software and to have it updated, ie: you want the latest version of Firefox and I want it to stay updated. For this purpose we have a simpler view of a set of packages from the same publisher with the same name which we call a "product." Most interactions with the CoApp GUI is with software at the product level instead of the package level. This isn't to say that interacting directly with packages isn't allowed or easy to do, a user certainly can and it's straightforward to do. 

As we walk through the screenshots, you'll notice the similarity to the Windows App Store. This is not coincidental for a few reasons. First by making it as similar as possible to one of the primary methods of software distribution on Windows 8 we feel users will feel at home working with CoApp. Second, we know the App Store design has gone through numerous usability studies and redesign to become as straightforward for the end user. Considering we have very few resources to perform that kind of research, it seems practical to utilize the research that's already been performed.

With all that out of the way, let's get to the screenshots and walk through of the GUI.

*Note: logos are used for illustration purposes only. While we certainly hope all of the open source projects illustrated will have CoApp packages, this isn't intended to indicate that they necessarily will.*

#Product/Package Manager

@[Home screen of the product manager](/images/blog/guipreview/homepage.png)

This is the home screen of the product manager that the user will see when they start the software. In fitting with Metro principles, the list of groups scroll left to right. The groups come from two places. First each package will be required to set a category. Secondly the user can use the Add a Feed button on the top right (or from the Setting screen) to add more feed urls. These feed URLs will be added to the home screen. Not shown is a link near the top right that would shows the user all installed products.

##Universal Search

Not visible is that search is pervasive throughout the GUI. Simply typing begins a search (as long as a textbox doesn't have focus of course) or continues a search . In fact the search screen is reused for the installed products screen and the screen for showing all products in a category and from a feed.

@[Games/Search screen](/images/blog/guipreview/games.png)

The screenshot above illustrates the design of the search screen, in this case it's showing all products in the Games categories. Above the list of products are filters (no the filter doesn't really do anything in the mockup :). CoApp utilizes a filtering concept we're calling "frictionless filtering." To add a filter, the user presses the the create filter button with the plus on the right side of the list of filters. After pressing the button a menu drop down with a list of possible attributes that a user can filter based on and an appropriate UI elements to create a filter for the given attribute. Once the user creates a filter, the filter replaces the button that was originally pressed. A new create filter button is created to the right of all the filters. To delete a filter, the user presses one of the previously created filters. The system is straightforward, intuitive and extremely powerful.

Once the user clicks on a product, the following screen will be displayed:

@[Product screen](/images/blog/guipreview/product.png)

Should the user click the name of the publisher or one of the contributors, a bit of UI will be display providing information about the selected entity:

@[Contributor information](/images/blog/guipreview/contributor.png)

When the user sees the details tab, it will look like so:

@[Details](/images/blog/guipreview/productdetails.png)

The details tab provides more advanced information that the user might be interested in. Selecting one of the package versions will send the user to the screen for that package.

@[Reviews](/images/blog/guipreview/productreviews.png)

Reviews for products are actually a combination of reviews for every package in a product. New reviews for a product are considered reviews of the latest package. This allows users to handle reviews in a way that feels natural but still provides all users with package level feedback should they want it. The slider above the reviews allows the user to filter based on how recent the reviewed version is.

@[Installing Product](/images/blog/guipreview/installpopup.png)

Installing a product with dependencies will ask the user whether they want to all the dependencies of the product. As you can see in the upper right corner, there is a link, in this case titled "4 packages installing"  to see what packages are being installed. If there is an error during installation, the link will note that an error occurred, turn red and an exclamation point will slowly flash next to the link.

@[Install Blocked](/images/blog/guipreview/installblocked.png)

If a product or one of it's dependencies is blocked, the user will be asked to unblock the blocked packages.

@[Package details](/images/blog/guipreview/packagedetails.png)

On the package page, the details tabs show slightly different information that the user might want to know versus the product page. Specifically, the license for the package is shown and which versions this package is binary compatible with.

@[Installing screen](/images/blog/guipreview/installing.png)

The installing screen is again available from pressing the link in the top right hand corner of the application.

#Again, this looks neat but when do I get it?

The current timeline is to have this full GUI available for the release candidate which is around 8 weeks out.

Any feedback you can provide would be greatly appreciated! Please provide feedback on this post, the CoApp [mailing list](https://launchpad.net/~coapp-developers), the CoApp [IRC channel](http://coapp.org/developers/irc.html) or to me via [Twitter](https://twitter.com/wwahammy).