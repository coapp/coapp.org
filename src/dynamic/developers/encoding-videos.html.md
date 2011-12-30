---
layout: 'article'
title: 'Encoding videos into .mp4 and .webm formats' 
version: '1.0'
docid: 'developer:encoding-video'
---
### Requirements
You'll need the following in order to correctly set up your development environment for working on CoApp:

- **VLC** -- Download VLC from [Videolan](http://videolan.org) -- install into the default location.
- **Transcode.cmd** -- get the [batch file](/sitefiles/transcode.zip) -- unpack into your path somewhere.

#### The script file usage:

``` bat
Dual VLC Transcoder - makes H.264 [.mp4] and WebM [.webm] videos
----------------------------------------------------------------

Usage:
------

transcode.cmd \path\to\sourcevideofile.avi \path\to\destination_name

     sourcevideofile can be nearly any video type--avi,wmv,mkv..etc.

     Don't specify the output extension, .mp4 and .webm will be appended.

```

and an video showing how to use it:

%[704,480,encoding-video.png,http://coapp.org/videos/encoding-video.mp4,http://coapp.org/videos/encoding-video.webm]
