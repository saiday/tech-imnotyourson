---
title: "Android N uses Java nio buffer asReadOnlyBuffer() cause 8 bits shift bug"
slug: "android-n-uses-java-nio-buffer-asreadonlybuffer-cause-8-bits-shift-bug"
date: "2017-01-06T11:22:45.000Z"
description: "I've encountered a weird bug that a which is returned by method, could randomly 8 bits shift on result (mostly it's left shift). I have no clue, but stop using..."
tags: ["buffer", "android"]
draft: false
---

I've encountered a weird bug that a `java.nio.buffer` which is returned by `asReadOnlyBuffer()` method, could **randomly** 8 bits shift on `get()` result (mostly it's left shift).

I have no clue, but stop using buffer that returned by `asReadOnlyBuffer()` works fine. This issue only happens on Android N.
