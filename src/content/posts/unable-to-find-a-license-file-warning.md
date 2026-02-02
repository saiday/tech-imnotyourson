---
title: "Unable to find a license file warning"
slug: "unable-to-find-a-license-file-warning"
date: "2013-07-01T18:07:00.000Z"
description: "When your GitHub projects have no License file on it and you tried to submit your projects as pods to . In the process, you will get a warning like this: WARN..."
tags: ["CocoaPods"]
draft: false
---

When your GitHub projects have no **License file** on it and you tried to submit your projects as pods to [CocoaPods](http://cocoapods.org/).
In the `pod sepc lint /your project/` process, you will get a warning like this:

> WARN  | [iOS] Unable to find a license file

The first thing you have to do is to push a **License file** on GitHub. For example if your open source license goes for **MIT License** it will looks like this:

```

  Version 1.0

  Created by Saiday on 01/14/2013.
  Copyright 2013 Saiday

 This code is distributed under the terms and conditions of the MIT license.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
```

### GitHub Tag ###
Notice that if you already tag your projects for CocoaPods pod version, you have to re-tag it after you pushed the **License file**.


## Try lint again ##
Try `pod spec lint /your project/` again, if you still get the `WARN  | [iOS] Unable to find a license file` warning, it because of CocoaPods caches issue.

### Delete CocoaPods caches data ###

`rm -rf /Users/YourName/Library/Caches/CocoaPods/GitHub/`     

then  

`mkdir /Users/YourName/Library/Caches/CocoaPods/GitHub/`

Now, it should works.
