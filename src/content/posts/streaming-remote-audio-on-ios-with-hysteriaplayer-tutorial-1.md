---
title: "Streaming remote audio on iOS with HysteriaPlayer Tutorial (1)"
slug: "streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-1"
date: "2014-02-03T20:25:56.000Z"
description: "In this part of tutorial, I am going to write an iOS application that plays remote audios with functions we listed at . And will talk about the essential..."
tags: ["iOS", "HysteriaPlayer", "Tutorial"]
draft: false
---

![Hysteria Player](/content/images/2014/Jan/Hysteria.jpg)

In this part of tutorial, I am going to write an iOS application that plays remote audios with functions we listed at [last post](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-0-2/).  
And will talk about the essential concepts of [HysteriaPlayer](https://github.com/StreetVoice/HysteriaPlayer).

### Catalog ###
In [part 0](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-0/), what we want? why HysteriaPlayer?

In [part 1](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-1/), demonstrating how to play remote audios with HysteriaPlayer.

In [part 2](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-2/), making a simple player user interface. 

In [part 3](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-3/), registering lock screen details and remote controls. 


You can download source code [here](https://github.com/saiday/HysteriaPlayerTutorial) with branch `tutorial-1`.

***

## Installation ##
HysteriaPlayer can be installed and configured on [CocoaPods](cocoapods.org) which is an dependency manager for Objective-C projects.

I highly recommend  using CocoaPods to help you scale your project. 
It's elegant, clever and make your project maintainable.

If you are not familiar with CocoaPods, check [offical guides](http://guides.cocoapods.org/using/index.html), you should take a look at [Getting Started](http://guides.cocoapods.org/using/getting-started.html) for installing CocoaPods and [Using CocoaPods](http://guides.cocoapods.org/using/using-cocoapods.html) for understanding the flows of dependencies management of CocoaPods.

When you successfully installed CocoaPods, launch your terminal and run `pod search hysteriaplayer`, it will list versions of HysteriaPlayer that available.
Create or open your `Podfile` and insert this line into it. (newest version of HysteriaPlayer instead of x.x.x)

```bash
pod 'HysteriaPlayer',      `~> x.x.x`
```

run `pod install` and there you go.

One last thing to do, select your application target in Xcode, in the **Capabilities** tab enable **Audio and AirPlay** checkbox inside **Background Modes** field. Applications without registered background playable can't play or stream audio when app isn't in foregrond or device locked. 

![](/content/images/2014/Feb/background_playable.png)

## How to use ##

#### Setup ####

I started a new project, added two buttons in xib. That's it.

> There's a huge update for HysteriaPlayer from 1.x to 2.x, this tutorial targeted on 2.x.

Now following step by step tutorials:

Create a `HysteriaPlayerManager` as following Set-up.

<script src="https://gist.github.com/saiday/9552074.js"></script>
<script src="https://gist.github.com/saiday/9552109.js"></script>

`Song` is our model object.  
`PlayingItems` is the queue system for HysteriaPlayer.
`registerHandlerReadyToPlay:` and `registerHandlerFailed:` are optional event callbacks.

Create a **PlayingItems** class extends `NSObject`, we will store our queues there. Ensuring that only one instance of a PlayingItems is created, PlayingItems should implement [singleton pattern](http://en.wikipedia.org/wiki/Singleton_pattern).

<script src="https://gist.github.com/saiday/8807911.js"></script>

#### Ready to go ####

To starting a new playback, you have to renew HysteriaPlayer's data source by `setupSourceGetter:ItemsCount:` method by `HysteriaPlayerManager`.

<script src="https://gist.github.com/saiday/8808804.js"></script>

`responseObject` is what [iTunes API](http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html) responsed, in this tutorial we searching fo [U2](https://itunes.apple.com/lookup?amgArtistId=5723&entity=song&limit=5&sort=recent) and [Jack Johnson](https://itunes.apple.com/lookup?amgArtistId=468749&entity=song&limit=%i&sort=recent).

When buttons tapped, change the API endpoint and everythings done.

<script src="https://gist.github.com/saiday/8809005.js"></script>

You should hear music playing now, dead simple.

next post: [Streaming remote audio on iOS with HysteriaPlayer Tutorial (2)](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-2/)
