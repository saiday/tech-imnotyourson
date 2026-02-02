---
title: "UICollectionView responding to device rotation with animation"
slug: "uicollectionview-responding-to-device-rotation-with-animation"
date: "2015-07-14T08:00:34.000Z"
description: "When device rotating, UICollectionView needs to recalculate the insets of cells for new bounds in most case. is the simplest way to do it, but it won't feel..."
tags: ["UICollectionView", "Rotate"]
draft: false
---

When device rotating, UICollectionView needs to recalculate the insets of cells for new bounds in most case.
`[UICollectionView reloadData]` is the simplest way to do it, but it won't feel good when you seeing your views move to new place instantly.

This is my solution:
<script src="https://gist.github.com/saiday/e8ea1a5165ca469baee4.js"></script>
