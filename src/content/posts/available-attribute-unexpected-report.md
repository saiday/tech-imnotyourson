---
title: "@available attribute got unexpected '@' in program on CI environment"
slug: "available-attribute-unexpected-report"
date: "2017-10-19T10:08:07.000Z"
description: "I've used attribute in my codebase and CI failed to build. The reason is I use an older SDK to build application which older than my version argument. This..."
tags: ["CI"]
draft: false
---

I've used `@available(iOS 11.0, *)` attribute in my codebase and CI failed to build.

The reason is I use an older SDK to build application which older than my `@available` version argument.

This report message can be improved. 
It misled me to check `Enable Modules` compiler flag, but no, that's not the case.
