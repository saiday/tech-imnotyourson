---
title: "Multiple GoogleService-Info.plist during iOS preprocessing"
slug: "multiple-googleservice-info-plist-during-ios-preprocessing"
date: "2017-04-25T19:08:42.000Z"
description: "If you ever integrate Firebase, it needs file as configuration. What if you have multiple target or scheme that targeting on multiple Firebase project? If..."
tags: ["preprocessing", "GoogleService-Info.plist"]
draft: false
---

If you ever integrate Firebase, it needs `GoogleService-Info.plist` file as configuration.

What if you have multiple target or scheme that targeting on multiple Firebase project?

If target is your only factor to Firebase project, it's simple, download multiple `GoogleService-Info.plist`, place it into actual folder (not Xcode group) and set **target membership** correct at file inspector.
Without rename, run script, that's it.

For me, I build debug and production with two targeting market as my app variants. 4 possible configurations.
Automate corresponding `GoogleService-Info.plist` process is essential.

Here's my simplified Run Script Phase, take a look:
<script src="https://gist.github.com/saiday/cc7ca2cfb2ec5eca833603f28e78dd58.js"></script>
