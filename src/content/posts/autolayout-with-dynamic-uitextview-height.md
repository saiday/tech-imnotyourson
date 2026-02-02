---
title: "AutoLayout with Dynamic UITextView height"
slug: "autolayout-with-dynamic-uitextview-height"
date: "2014-01-24T15:03:37.000Z"
description: "First, disable UITextView's scrollable. Two options: 1. uncheck in . 2. Create a UITextView and connect it with IBOutlet (). Add a dummy UITextView height..."
tags: ["iOS", "AutoLayout"]
draft: false
---

First, disable UITextView's scrollable.

Two options:
1. uncheck `Scrolling Enabled` in `.xib`.
2. `[TextView setScrollEnabled:NO];`

Create a UITextView and connect it with IBOutlet (`TextView`).
Add a dummy UITextView height constraint with default height, connect it with IBOutlet (`TextViewHeightConstraint`). 
When you set your UITextView’s text asynchronously you should calculate the height of UITextView and set UITextView’s height constraint to it.

sample code snippet:
```objc
[TextView setText:song.lyrics];
       
CGSize sizeThatFitsTextView = [TextView sizeThatFits:CGSizeMake(TextView.frame.size.width, MAXFLOAT)];
       
TextViewHeightConstraint.constant = sizeThatFitsTextView.height;
```
