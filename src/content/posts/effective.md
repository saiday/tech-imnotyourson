---
title: "Effective corner radius"
slug: "effective"
date: "2016-08-09T06:56:43.000Z"
description: "Rather than setting layer's corner radius: You should perform drawing, this is more efficient. This is my code snippet."
tags: ["corner radius"]
draft: false
---

Rather than setting layer's corner radius:
```objc
    image.layer.cornerRadius = 20;
    image.layer.masksToBounds = YES;
```

You should perform drawing, this is more efficient.
<script src="https://gist.github.com/saiday/edf88d44932accb6ccd6f4ae659ec3d8.js"></script>

This is my code snippet.
