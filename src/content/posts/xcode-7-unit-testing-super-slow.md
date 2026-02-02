---
title: "Xcode 7 unit testing extremely slow"
slug: "xcode-7-unit-testing-super-slow"
date: "2015-10-01T18:02:05.000Z"
description: "Xcode 7 is extremely slow when unit testing, ASAIK there's two ways to boost it up. 1. Use iOS 8 simulator 2. Turn off and in your projects's build settings..."
tags: ["Unit Test", "Xcode"]
draft: false
---

```
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
... cannot merge previous GCDA file: corrupt arc tag (0x00000000)
...
```

Xcode 7 is extremely slow when unit testing, ASAIK there's two ways to boost it up.

1. Use iOS 8 simulator
2. Turn off `Generate Legacy Test Coverage Files` and `Instrument Program Flow` in your projects's build settings

```objc
GCC_GENERATE_TEST_COVERAGE_FILES = NO;
GCC_INSTRUMENT_PROGRAM_FLOW_ARCS = NO;
```

Still I got some strange behaviours on testing, and I don't know why and how to fix it.
When unit testing, my object not been released(dealloc) immediately, the timing seems a little bit deferred.
