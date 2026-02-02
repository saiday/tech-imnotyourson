---
title: "UIScrollView with soften edges"
slug: "scrollview-with-soften-edges"
date: "2015-03-19T14:30:15.000Z"
description: "When contents inside UIScrollView been trimmed away by flat edges, it looks looks weird on blurred view. All we need to do is customize mask layer for our..."
tags: ["iOS", "UIScrollView"]
draft: false
---

![](/content/images/2015/Mar/2015_03_19_22_17_22.png)

When contents inside UIScrollView been trimmed away by flat edges, it looks looks weird on blurred view.

All we need to do is customize mask layer for our UIScrollView. For example I add a mask layer to UITableView.

<script src="https://gist.github.com/saiday/2242182fc01fc1be62be.js"></script>
