---
title: "Streaming remote audio on iOS with HysteriaPlayer Tutorial (2)"
slug: "streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-2"
date: "2014-03-14T17:20:24.000Z"
description: "In this part of tutorial, I am going build a simple player interface with HysteriaPlayer. The simple interface with those basic views and elements. - Play,..."
tags: ["iOS", "HysteriaPlayer", "Tutorial"]
draft: false
---

![Hysteria Player](/content/images/2014/Jan/Hysteria.jpg)

In this part of tutorial, I am going build a simple player interface with HysteriaPlayer.
The simple interface with those basic views and elements.

- Play, Pause, Next, Previous function
- Repeat, Shuffle function
- Playing item's current and duration time
- Slider that seeks to time in HysteriaPlayer
- Artwork with [SpinningDiskView](https://github.com/saiday/SpinningDiskView)

### Catalog ###
In [part 0](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-0/), what we want? why HysteriaPlayer?

In [part 1](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-1/), demonstrating how to play remote audios with HysteriaPlayer.

In [part 2](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-2/), making a simple player user interface. 

In [part 3](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-3/), registering lock screen details and remote controls. 


You can download source code [here](https://github.com/saiday/HysteriaPlayerTutorial) with branch `tutorial-2`.

***

I created a new `PlayerViewController` class extends `UIViewController` and dragged some views on xib. Assuming everyone is familiar with that. We skip this process.

We have to implement `HysteriaPlayerDelegate` protocol in `PlayerViewController`. `HysteriaPlayerDelegate` protocol have four optional methods that releated to interface updating. [Docs](https://github.com/StreetVoice/HysteriaPlayer#delegate)

- **- (void)hysteriaPlayerCurrentItemChanged:(AVPlayerItem *)item;**
- **- (void)hysteriaPlayerRateChanged:(BOOL)isPlaying;**
- **- (void)hysteriaPlayerDidReachEnd;**
- **- (void)hysteriaPlayerCurrentItemPreloaded:(CMTime)time;**

<script src="https://gist.github.com/saiday/9555056.js"></script>

Back to `PlayerViewController.m`, we have to add and remove delegate with `addDelegate:` and `removeDelegate:` mothods when `PlayerViewController` didAppear and didDisappear. 
Note that `HysteriaPlayer` not using `HysteriaPlayer.delegate` but add/remove delegates because it allows multiple delegates at the same time.

<script src="https://gist.github.com/saiday/9555525.js"></script>

Implementing two `HysteriaPlayerDelegate` protocol methods: `hysteriaPlayerCurrentItemChanged:` and `hysteriaPlayerRateChanged:`

<script src="https://gist.github.com/saiday/9555548.js"></script>

I used [SpinningDiskView](https://github.com/saiday/SpinningDiskView) to display artwork.


seetToTime, current/duration time, next, previous...

not finished.
