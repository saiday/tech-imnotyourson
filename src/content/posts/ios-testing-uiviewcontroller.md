---
title: "iOS testing UIViewController"
slug: "ios-testing-uiviewcontroller"
date: "2013-09-12T17:56:00.000Z"
description: "I spend a lot of time to figure it out how to test . Notes here: UIViewController didn't load when initiated An class been initiated and shown didn't mean it's..."
tags: ["iOS", "Unit Test"]
draft: false
---

I spend a lot of time to figure it out how to test `UIViewController`.

#### Notes here: ####

### UIViewController didn't load when initiated ##

```objc
	UIStoryboard *storyboard =[UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
	MyViewController *viewController =[storyboard instantiateViewControllerWithIdentifier:@"MyController"];
```

An `UIViewController` class been initiated and shown didn't mean it's been loaded. You can't reach IBOutlets instances, IBActions at this state.

```objc
	[viewController view];
```

This will load up the view from the `StoryBoard`, then invoke its -viewDidLoad. You should then be able to test its state.

### ViewWillAppear, ViewWillDisappear, ViewDidAppear, ViewDidDisappear get called but get unexpected results (nil objects)###

Unit tests run synchronously. Anything that is — or can be — animated won't work in a normal unit test, because the test will be done before the change takes place.

Be careful to set `animation:NO` to above methods in unit tesing.

```objc
	[viewController viewWillAppear:NO];
```
