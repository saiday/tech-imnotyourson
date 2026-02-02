---
title: "Alcatraz and plugins disappeared each time you upgrade Xcode"
slug: "alcatraz-and-plugins-disappeared-everytime-you-upgrade-xcode"
date: "2015-10-23T16:41:44.000Z"
description: "Your and Xcode plugins disappeared each time you upgrade your Xcode huh? That's because Apple trying to prevent Xcode plugin is incompatible with new Xcode,..."
tags: ["Xcode", "Alcatraz"]
draft: false
---

Your [Alcatraz](http://alcatraz.io/) and Xcode plugins disappeared each time you upgrade your Xcode huh?

That's because Apple trying to prevent Xcode plugin is incompatible with new Xcode, lead to crash on launch. Apple choose a rough and irresponsible way, only plugins match `DVTPlugInCompatibilityUUIDs` be loaded.

Here's a snippet I used to reactivate my plugins.

```bash
find ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins -name Info.plist -maxdepth 3 | xargs -I{} defaults write {} DVTPlugInCompatibilityUUIDs -array-add `defaults read /Applications/Xcode.app/Contents/Info DVTPlugInCompatibilityUUID`
```

For those who accidentally click **Skip Bundle**, here's another snippet for you, sadly.

```bash
defaults delete com.apple.dt.Xcode DVTPlugInManagerNonApplePlugIns-Xcode-{your_xcode_version}
```
