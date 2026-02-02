---
title: "UIWebView handle HTML <input> file multiple selection solution"
slug: "uiwebview-handle-html-input-file-multiple-selection-solution"
date: "2017-08-09T18:57:17.000Z"
description: "UIWebView will append attribute to HTML `WKWebViewUIWebView` correctly."
tags: ["iOS", "UIWebView", "WKWebView"]
draft: false
---

UIWebView will append `multiple` attribute to HTML `<input type="file">` tag automatically.
This behaviour varies from iOS versions, I thought this is a UIWebView's bug.

The solution is use [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) instead.
`WKWebView` outperformed `UIWebView` and handles `<input type="file">` correctly.
