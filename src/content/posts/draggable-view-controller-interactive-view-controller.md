---
title: "Draggable view controller? Interactive view controller!"
slug: "draggable-view-controller-interactive-view-controller"
date: "2015-06-15T13:33:30.000Z"
description: "Update - 2015.11.19 lots people says shut up and show me the code. - 2019.02.21 Community Contributors' projects: - by ostathnicky - by Soan Saini - by Serhii..."
tags: ["UIViewControllerAnimatedTransitioning", "UIPercentDrivenInteractiveTransition", "UIViewControllerTransitioningDelegate", "draggable", "interactive view controller", "UIViewController"]
draft: false
---

![](/content/images/2015/Jun/draggable_view_controller-1.gif)

###### Update
- 2015.11.19 lots people says shut up and show me the code. [Demo project](https://github.com/saiday/DraggableViewControllerDemo)


- 2019.02.21
Community Contributors' projects:
  - [Swift version](https://github.com/ostatnicky/DraggableViewController) by ostathnicky
  - [Xamarin version](https://github.com/alastor09/DraggableViewController) by Soan Saini 
  - [SwipeableCards (Swift)](https://github.com/Kharauzov/SwipeableCards) by Serhii

----

This post is aiming at the topic of UIViewController transitions. The gif shows what we are going to do — present ViewController from ViewController by dragging.

### What is it?

To be short, you can't actually drag a `UIViewController` to anywhere. 
What makes you feel UIViewController animate from here to there is [UIViewControllerAnimatedTransitioning](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/), interact with it according to gestures turns out to be misleading.

### How to do it

#### Design philosophy
There is no two `UIViewController` in together, instead there's only one `UIViewController` at a time. When user begin drag on certain subview, present another view controller with custom [UIViewControllerAnimatedTransitioning](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/) by custom [UIPercentDrivenInteractiveTransition protocol](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPercentDrivenInteractiveTransition_class/).

#### Technical things
These two protocols are the foundation of customizing interactive `UIViewController` transitions. In case you don't know yet, take a glance before starting.
1. [UIViewControllerAnimatedTransitioning protocol](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/)
2. [UIPercentDrivenInteractiveTransition protocol](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPercentDrivenInteractiveTransition_class/)


Your `UIViewController` implements [UIViewControllerTransitioningDelegate protocol](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/) to tell which animator and interactor are gonna used by custom transitions.


## Customize transitions

### Animators

#### BaseAnimator

<script src="https://gist.github.com/saiday/6326072fb227c140bbf0.js"></script>
<script src="https://gist.github.com/saiday/9d0b73f86fd61645b3fe.js"></script>

`mustOverride()` is a marco took from [stackoverflow Yar's answer](http://stackoverflow.com/a/6448761/1554531), or you can use nicklockwood's solution [MustOverride GitHub](https://github.com/nicklockwood/MustOverride). You can leave it blank as well, what `mustOverride()` does is throw an exception when we forget to override the method in subclasses.

`BaseAnimator` do only one thing, it determine if it's presenting or dismissing and call the corresponding method.

#### MiniToLargeViewAnimator
<script src="https://gist.github.com/saiday/1aa2a2bba3b6258a064d.js"></script>
<script src="https://gist.github.com/saiday/4872f8d26bdd0796874a.js"></script>

The trick is `initialY` property, as you can see, the `UIViewController` which transition customized will starts from `initialY` and ends at `initialY` as well. `initialY` is where our mini view located.

At the time user begin dragging, we present a new `UIViewContrller` and customize our `transitionContext` to make it looks like the same as last `UIViewController`.

`- (UIView *)fakeMiniView` returns fake `subview` from last `UIViewController`, you may either mock a new one or [snapshot](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIScreen_Class/#//apple_ref/doc/uid/TP40006903-CH3-SW29) existing one, choosing a practice that fits with your use case.

### Implement animators
Let's say we present `NextViewController` from `ExistViewController`.
In `ExistViewController.m` we declare class extension and implements [UIViewControllerTransitioningDelegate](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/).

#### ExistViewController
<script src="https://gist.github.com/saiday/ac927cbd746e0e113019.js"></script>

**From now, you got a customized transitions animator, and sets up by [UIViewControllerTransitioningDelegate](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/).**


#### present UIViewController
<script src="https://gist.github.com/saiday/bd98e6c6507be7f14795.js"></script>

You should see your customized transition works.

## Transitions response to gesture
#### MiniToLargeViewInteractive
<script src="https://gist.github.com/saiday/553a53e3bd49932f2501.js"></script>
<script src="https://gist.github.com/saiday/afbea1dbea83d5866774.js"></script>

`attachToViewController:withView:presentViewController:` is helper mehtod, encapsulate gesture bindings.

In `ExistViewController`, create two Interactors of presenting and dismissing, implement `interactionControllerForPresentation:` and `interactionControllerForDismissal:` methods from [UIViewControllerTransitioningDelegate](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewControllerTransitioningDelegate_protocol/).

#### ExistViewController
<script src="https://gist.github.com/saiday/6b6bfb37a5f83e6a1599.js"></script>

There's a `BOOL` property `disableInteractivePlayerTransitioning` indicates if we want to skip custom `UIPercentDrivenInteractiveTransition` or not, if you want modal or dismiss ViewController directly, then set it to `NO`.

That's it.

Feel free to comment.

###### Update
- 2015.11.19 lots people says shut up and show me the code. [Demo project](https://github.com/saiday/DraggableViewControllerDemo)


- 2019.02.21
Community Contributors' projects:
  - [Swift version](https://github.com/ostatnicky/DraggableViewController) by ostathnicky
  - [Xamarin version](https://github.com/alastor09/DraggableViewController) by Soan Saini 
  - [SwipeableCards (Swift)](https://github.com/Kharauzov/SwipeableCards) by Serhii
