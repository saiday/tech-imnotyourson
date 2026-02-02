---
title: "Unit tests with memory leaks assertion"
slug: "unit-tests-that-avoid-memory-leaks"
date: "2015-09-17T15:38:35.000Z"
description: "If you are an iOS programmer, you must had set breakpoints at method to check is this object leaked. huh? Memory leaks can be harmful, but it's trivial...."
tags: ["Unit Test", "Memory Leak", "Aspect"]
draft: false
---

If you are an iOS programmer, you must had set breakpoints at `dealloc` method to check is this object leaked. huh?
Memory leaks can be harmful, but it's trivial.

Checking and avoiding memory leaks in test cases is efficient and elegant.

We use [Aspect](https://github.com/steipete/Aspects) to check is specific `selector` been called.

<script src="https://gist.github.com/saiday/fe60b1518d33144f6bad.js"></script>

That's it, simple. It will be evaluate when each test cases finished.
The more statements you covered in unit tests, the more chances you find out memory leaks. 

#### Tricky part - KVO'ed object
If your object been key-value observed, this could be a little bit tricky, Aspects can not handle method swizzling on KVO'ed object very well.  

Quoting from Aspect's [README](https://github.com/steipete/Aspects#compatibility-and-limitations)
> KVO works if observers are created after your calls aspect_hookSelector: It most likely will crash the other way around. Still looking for workarounds here - any help appreciated.

I had a workaround of KVO'ed object. Hooking class object instead of instance, this could be ambiguous for hooked instance, but it's fine since we using it in unit tests. If you followed unit testing principle that test cases had no dependencies with others, it should behaves like hooking to an instance.
<script src="https://gist.github.com/saiday/c2cbd112c7f0b646f6de.js"></script>


PS. My matcher is [OCHamcrest](https://github.com/hamcrest/OCHamcrest) and Unit test framework is build-in `XCTest`.
