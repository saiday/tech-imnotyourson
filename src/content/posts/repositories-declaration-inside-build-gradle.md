---
title: "repositories declaration inside build.gradle"
slug: "repositories-declaration-inside-build-gradle"
date: "2018-10-25T10:00:21.000Z"
description: "I've been confused about the different repositories declaration inside . There are: - inside top-level 's block - inside top-level 's block - inside each..."
tags: ["Gradle"]
draft: false
---

I've been confused about the different repositories declaration inside `build.gradle`.

There are:

- `repositories` inside top-level `build.gradle`'s `buildscript` block
- `repositories` inside top-level `build.gradle`'s `allprojects` block
- `repositories` inside each module `build.gradle`'s `buildscript` block
- `repositories` at each module `build.gradle`

Breaking down to 2 differences, `repositories` inside `buildscript` block and others.

###### inside `buildscript` block
The `buildscript` configuration section is for gradle itself (i.e. changes to how gradle is able to perform the build).
So the `repositories` here only affecting gradle building process.

###### inside top-level `allprojects` or module
The `allprojects` section is for the modules being built by Gradle, hence `repositories` inside the module is module specified.

This type of `repositories` is where your `dependencies` used to look up packages.
