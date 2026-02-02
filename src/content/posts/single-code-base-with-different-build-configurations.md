---
title: "Single code base with different build configurations"
slug: "single-code-base-with-different-build-configurations"
date: "2015-06-17T10:15:07.000Z"
description: "Don't make more versions of your source code. Rather than add more code bases, fix the underlying design problem that is preventing you from running from a..."
tags: []
draft: false
---

> Don't make more versions of your source code. Rather than add more code bases, fix the underlying design problem that is preventing you from running from a single code base. From [Extreme Programming Explained](http://www.amazon.com/Extreme-Programming-Explained-Embrace-Edition/dp/0321278658)

For a app developer, usually we had to modify our app for specific targets and markets, different login paths, alternative functions, various layouts, etc.
It's ok to have a helper function to check locales for us, but what if we had to separate our source code into two apps, just like [Evernote](https://itunes.apple.com/tw/app/evernote/id281796108?mt=8) and [印象筆記 (Evernote for China market)](https://itunes.apple.com/cn/app/yin-xiang-bi-ji/id281796108?mt=8).
**Different bundle ids, backend servers, might even icons!**

## Build configurations

Create a new `Build Configuration` set:
![](/content/images/2015/Jun/Screenshot_6_17_15__4_38_PM.png)

### Preprocessor Macros

In project's `build settings`, find preprocessor marcros column, you can define different values for each of your configurations. You can define `KEY=VALUE` or just `KEY` macros here.
![](/content/images/2015/Jun/Screenshot_6_17_15__5_15_PM.png)

In your code, you can implement preprocessor marcos like this:
```objc
#ifdef foo
	// somethings
#else
	// some other things
#endif
```

### User-Defined Settings
Go to your project's `build settings`, select `Editor` -> `Add Build Setting` -> `Add User-Defined Settings.`
![](/content/images/2015/Jun/Screenshot_6_17_15__5_26_PM.png)

You will get a `User Defined` field. For my usage, I create two values named `APP_NAME` and `BUNDLE_ID`.
![](/content/images/2015/Jun/Screenshot_6_17_15__5_31_PM.png)

In my `-info.plist`, I changed my `Bundle display name` and `Bundle identifier` value to `${APP_NAME}` and `${BUNDLE_ID}`.

![](/content/images/2015/Jun/Screenshot_6_17_15__5_34_PM.png)

### App icons
I use **Asset Catalog** handling my image resources, inside`Images.xcassets` create a new `App icon` set.
![](/content/images/2015/Jun/Screenshot_6_17_15__5_39_PM.png)

Back to your **target** `build settings`, you can find `Asset Catalog App Icon Set Name` field, specify which App icon set shuld be used for configurations.
![](/content/images/2015/Jun/Screenshot_6_17_15__5_40_PM.png)

That's it.

## Builds
### Xcode
From `Scheme editor`, select which build configurations you want to apply.
![](/content/images/2015/Jun/Screenshot_6_17_15__5_44_PM.png)

### Command lines
If you run [Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) for your project, you must build your project with [xcodebuild](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html) or [xctool](https://github.com/facebook/xctool), they both had `-configuration` flag, specify your build configuration name to it.
