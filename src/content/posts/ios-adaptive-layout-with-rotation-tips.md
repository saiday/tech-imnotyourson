---
title: "iOS Adaptive Layout with AutoLayout Rotation tips"
slug: "ios-adaptive-layout-with-rotation-tips"
date: "2015-07-27T09:08:12.000Z"
description: "If you had a ScrollView as root view of UIViewController, you might see your layouts deranged when view size changing (rotating). If you don't have this issue,..."
tags: ["AutoLayout", "UIScrollView", "Adaptive"]
draft: false
---

If you had a ScrollView as root view of UIViewController, you might see your layouts deranged when view size changing (rotating). If you don't have this issue, congrats. If you do, here's my solution:

```
 ----------------------
|     UIScrollView     |
|                      |
|   ----------------   |
|  |     UIView     |  |
|  |                |  |
|  |                |  |
|   ----------------   |
|                      |
 ----------------------
```

For example, I had a UIScrollView and it's ContentView like this graph, I had 4 constraints pinned my UIView's edge to it's superview (UIScrollView), and UIScrollView also had 4 constraints pinned to it's superview. The case is when UIScrollView's superview size changes, UIScrollView fit the size as constraints defined perfectly, but UIView did no resize and had no AutoLayout runtime conflicts.

#### How to fix UIScrollView ContentSize issue
The reason why ContentView not resized is because UIScrollView not adjusting it's `contentSize`, the constraints set on ContentView is pinned to UIScrollView's `contentSize` not UIScrollView itself.

**To fix this issue, we need an equal width constraint on our ContentView. This constraint make UIScrollView's `contentSize` adaptively.**

> When UIScrollView first initiating, it's smart enough to set `contentSize` by our ContentView and constraints. If we don't handle rotations, then our UIScrollView's `contentSize` will be fixed, it's just fine we don't set width constraint and everything works.


#### New Rotation APIs for iOS 8+
We used to use `willRotateToInterfaceOrientation:duration:`, `didRotateFromInterfaceOrientation:`, `willAnimateRotationToInterfaceOrientation:duration:` for handling rotation, these APIs were deprecated from iOS 8.
Apple introduced `viewWillTransitionToSize:coordinator:` delegate method to replace it.
I found a very helpful snippet about `viewWillTransitionToSize:coordinator:` quoted from [@smileyborg](https://twitter.com/smileyborg) the author of [PureLayout](https://github.com/smileyborg/PureLayout).
```swift
override func viewWillTransitionToSize(size: CGSize,
                withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
    super.viewWillTransitionToSize(size, withTransitionCoordinator: coordinator)
    // Code here will execute before the rotation begins.
    // Equivalent to placing it in the deprecated method -[willRotateToInterfaceOrientation:duration:]
    coordinator.animateAlongsideTransition({ (context) -> Void in
        // Place code here to perform animations during the rotation.
        // You can pass nil for this closure if not necessary.
    },
    completion: { (context) -> Void in
        // Code here will execute after the rotation has finished.
        // Equivalent to placing it in the deprecated method -[didRotateFromInterfaceOrientation:]
}) }
```


## Advanced Usage

#### Relayout my views depends on size

That's say I had a view which is heavy customized. It should have different styles on portrait and landscape mode. For example:
![](/content/images/2015/07/adaptivelayoutprotrait.png)
![](/content/images/2015/07/adaptivelayoutlandscape.png)

Yes, we need two sets of NSLayoutConstraints, toggle the appropriate set.

To do this, we had to record the state of current view's orientation, I create a type representing orientation.
```objc
typedef NS_ENUM(NSInteger, MyViewOrientation) {
    MyViewOrientationUnspecified,
    MyViewOrientationPortrait,
    MyViewOrientationLandscape,
};
```

And update the state on `viewDidLayoutSubviews`, because `viewWillAppear` is too early and `viewDidAppear` is too late for updating constraints. (Leave your comments if you know more about this.)

```objc
- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    [self updateCurrentConstraintsToSize:self.view.bounds.size withTransitionCoordinator:nil];
}
```

```objc
- (void)updateCurrentConstraintsToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    
    MyViewOrientation orientation;
    if (size.width > size.height) {
        orientation = MyViewOrientationLandscape;
    } else {
        orientation = MyViewOrientationPortrait;
    }
    if (self.orientation != orientation && orientation != MyViewOrientationUnspecified) {
        [self.currentLayoutConstriants autoRemoveConstraints];
        if (orientation == PlayerViewOrientationPortrait) {
            self.currentLayoutConstriants = [self constraintsForPortrait];
        } else {
            self.currentLayoutConstriants = [self constraintsForLandscape];
        }
        self.orientation = orientation;
        
        if (coordinator) {
            self.swipeView.hidden = YES;
            NSInteger swipeViewPage = self.swipeView.currentPage;
            
            [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
                [self.currentLayoutConstriants autoInstallConstraints];
                [self.view layoutIfNeeded];
            } completion:nil];
        } else {
            [self.currentLayoutConstriants autoInstallConstraints];
            [self.view layoutIfNeeded];
            [self.swipeView reloadData];
        }
    }
}
```

When you been notified view size will change on new API
```objc
- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self updateCurrentConstraintsToSize:size withTransitionCoordinator:coordinator];
}
```

We use the coordinator from delegate to perform animations.


There's many ways to create `NSLayoutConstraint`, I prefer [PureLayout](https://github.com/smileyborg/PureLayout) style, here's my two sets of constraints for example:

```objc
- (NSArray *)constraintsForPortrait
{
    return [UIView autoCreateConstraintsWithoutInstalling:^{
        [self.swipeView autoMatchDimension:ALDimensionHeight toDimension:ALDimensionWidth ofView:self.view withMultiplier:scale];
        [self.swipeView autoMatchDimension:ALDimensionWidth toDimension:ALDimensionWidth ofView:self.view];
        [self.swipeView autoAlignAxisToSuperviewAxis:ALAxisVertical];
        [self.swipeView autoPinEdge:ALEdgeTop toEdge:ALEdgeBottom ofView:self.navigationBar withOffset:5.f];
         ...
    }];
}

- (NSArray *)constraintsForLandscape
{
    return [UIView autoCreateConstraintsWithoutInstalling:^{
        [self.swipeView autoMatchDimension:ALDimensionWidth toDimension:ALDimensionWidth ofView:self.view withMultiplier:.6f];
        [self.swipeView autoMatchDimension:ALDimensionHeight toDimension:ALDimensionWidth ofView:self.swipeView];
        [self.swipeView autoAlignAxisToSuperviewAxis:ALAxisHorizontal];
        [self.swipeView autoPinEdgeToSuperviewEdge:ALEdgeLeft withInset:15.f];
         ...
    }];
}
```

##### Idempotent and Performance

Idempotent means no matter how many times we trigger the method, the result should be the same. In this case we inactive constraints from old set and active constraints form new set. This cause performance issue when inactivating/activating constraints, since relayout method could be called very frequently from `viewDidLayoutSubviews`. So we need to check the state of orientation to ensure what we did is worthy.
