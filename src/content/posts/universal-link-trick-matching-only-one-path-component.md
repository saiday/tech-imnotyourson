---
title: "Universal Link trick: matching only one path component"
slug: "universal-link-trick-matching-only-one-path-component"
date: "2021-01-06T11:41:24.000Z"
description: "Let's say we want our apple-app-site-association rules to match only but not matching any more additional URL components based on it (such as ). What we have..."
tags: ["Universal Links", "iOS"]
draft: false
---

Let's say we want our apple-app-site-association rules to match only `<domain>/anypath/` but not matching any more additional URL components based on it (such as `<domain>/anypath/anotherpath/`).

What we have to write in apple-app-site-association is:
```
paths: [
    "NOT /*/?*",
    "/*/"
]
```

- `?`
  - matching one character
- `*`
  - matching zero to any characters

The `?*` pattern above implies there is more than one path component (at least one path component) matched.

The interesting thing is, if `*` is defined in the middle of the URL pattern, it does not allow `*` to match zero characters. (such as `/path/*/another/` will not match `path/another/`).
Only the trailing `*` would have zero characters matching behavior. 

That's why I consider it a trick.
