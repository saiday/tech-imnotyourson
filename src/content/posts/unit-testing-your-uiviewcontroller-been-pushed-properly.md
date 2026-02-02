---
title: "Unit testing your UIViewController been pushed properly"
slug: "unit-testing-your-uiviewcontroller-been-pushed-properly"
date: "2015-05-12T07:37:08.000Z"
description: "I had lots of UIViewController they ends up by pushing another UIViewController. That's say I had a it would push by . When writing unit tests we test..."
tags: ["Unit Test", "UINavigationController"]
draft: false
---

I had lots of UIViewController they ends up by pushing another UIViewController. That's say I had a `AUIViewController` it would push `BUIViewController` by `MyUINavigationController`.

When writing unit tests we test `AUIViewController` independently, in average cases `self.navigationController` will be nil.

We need a mock `UINavigationController` injected.

[AssociatedObject](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ObjCRuntimeRef/#//apple_ref/c/func/objc_setAssociatedObject) did the trick.

<script src="https://gist.github.com/saiday/36cb9103b1e726f97505.js"></script>

Don't forget `#import <objc/runtime.h>`

> My matcher is [OCHamcrest](https://github.com/hamcrest/OCHamcrest), mocking library is [OCMockito](https://github.com/jonreid/OCMockito) and Unit test framework is build-in `XCTest`.

[Category encapsulated open source on GitHub](https://github.com/saiday/MockUINavigationController)
