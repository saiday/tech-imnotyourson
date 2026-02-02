---
title: "Objective-C gets property value dynamically"
slug: "objective-c-gets-property-value-dynamically"
date: "2015-05-05T10:49:36.000Z"
description: "I had an entity object, some properties are nil some arn't. I want to list all non-nil properties and corresponding values. For example my entity looks like:..."
tags: ["objc/message.h", "objc_property_t"]
draft: false
---

I had an entity object, some properties are nil some arn't. I want to list all non-nil properties and corresponding values.

For example my entity looks like:
<script src="https://gist.github.com/saiday/71bc779eec2d904e6a06.js"></script>

`allValuesWithAuthFields:` returns a `dictionary` with property name as `key`, property value as `value`.


The engine part:
<script src="https://gist.github.com/saiday/5c3722d9cb6629561c5a.js"></script>

Oh, be sure you import `objc/message.h`, `#import <objc/message.h>`.

As you can see I use a marco `@keypath(self, type)` instead of a pure string.
Which is [EXTKeyPathCoding](https://github.com/jspahrsummers/libextobjc/blob/master/extobjc/EXTKeyPathCoding.h) provided by [libextobjc](https://github.com/jspahrsummers/libextobjc), automatically checks key paths at compile-time.
