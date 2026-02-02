---
title: "Free disk size by removing unused iOS DeviceSupport"
slug: "free-disk-size-by-removing-unused-ios"
date: "2016-07-31T18:08:36.000Z"
description: "may contains lots directories, each directory had massive size about 1.8G. If you ever develop on device with new iOS version, will add a new directory relate..."
tags: ["iOS DeviceSupport"]
draft: false
---

`~/Library/Developer/Xcode/iOS DeviceSupport/` may contains lots directories, each directory had massive size about 1.8G.

If you ever develop on device with new iOS version, `~/Library/Developer/Xcode/iOS DeviceSupport/` will add a new directory relate to it and never purge any.

#### What is iOS DeviceSupport about?
This directories did only one thing: symbolicate crash logs.

#### Is it safe to remove all of it?
Yes.

But strongly suggest you remove the old ones which you never used. If next time you connecting your iOS device, and there's no corresponding directory in `~/Library/Developer/Xcode/iOS DeviceSupport/`, Xcode will  download it back.
