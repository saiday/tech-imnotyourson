---
title: "Streaming remote audio on iOS with HysteriaPlayer Tutorial (0)"
slug: "streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-0"
date: "2014-01-30T17:38:32.000Z"
description: "What we want? We do want to stream remote audio file on our iOS device. It should have common functions that a standard Player will be needed. - queues - play..."
tags: ["iOS", "HysteriaPlayer", "Tutorial"]
draft: false
---

![Hysteria Player](/content/images/2014/Jan/Hysteria.jpg)

# What we want? #

We do want to **stream** remote audio file on our iOS device.
It should have common functions that a standard **Player** will be needed.

- queues
- play forword / next item
- buffering status handling
- get playing item's playing time and duration time

[HysteriaPlayer](https://github.com/StreetVoice/HysteriaPlayer) provides even more..

- played item lightweight cached.
- pre-buffer next item.
- playback logic mode (repeat, repeat one, shuffle)
- interrupting status handling
- background playable setted

### Before jumping into HysteriaPlayer ###

There are some options for developers who wants play audio on iOS devices.

* OpenAL
* Audio Service
* Core Audio
* AVFundation

#### OpenAL ####
OpenAL (Open Audio Library), It's a cross-platform 3D Audio API that is well-suited for use with games.

#### Audio Service ####
* not support mp3 format
* maximum of 30 seconds in caf, aif, or wav format  

#### Core Audio ####
> Core Audio is a `low-level API` for dealing with sound in Apple's Mac OS X and iOS operating systems.

This is the only way we take full control of audio playback.  
Though HysteriaPlayer Core Aduio version is developing, but it hasn't release and still have a long way to go.

#### AVFundation ####
Yes, HysteriaPlayer is sitting on top of AVPlayer.

# Why HysteriaPlayer? #
AVPlayer is a high-level instance of AVFundation. In fact, it's reliable and responsible, not like Android's `Media Player`..

But AVPlayer still too simple to be used directly, lack of some parts of basic function as a standard player.  
If we developers wants play remote audios we basically doing the same things when improving AVPlayer.  
**Stop Trying to Reinvent the Wheel**

And one great reason.

AVFoundation framework is updated frequently, deprecated and added lots APIs after new SDK released.

For these two reansons, we should maintain an player library that keeps abreast of modern developments and up with the times.
I've done one, then I open sourced it.

next post: [Streaming remote audio on iOS with HysteriaPlayer Tutorial (1)](http://imnotyourson.com/streaming-remote-audio-on-ios-with-hysteriaplayer-tutorial-1/)

---

[HysteriaPlayer on GitHub](https://github.com/StreetVoice/HysteriaPlayer)

[HysteriaPlayer on CocoaPods](https://github.com/CocoaPods/Specs/tree/master/HysteriaPlayer)
