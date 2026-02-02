---
title: "Swift lazy initializer with lookup ability if value equals nil"
slug: "swift-lazy-initializer-with-lookup-ability-if-value-equals-nil"
date: "2019-02-19T11:18:40.000Z"
description: "Why do we need it? When to use? If we are building an optional property which is massive resource consuming, the value is offed nil when some conditions are..."
tags: ["Swift", "lazy"]
draft: false
---

### Why do we need it? When to use?

If we are building an optional property which is massive resource consuming, the value is offed nil when some conditions are met.
We want the value been stored once it's off nil.

The property mentioned above is helpful in these scenarios:

- File directory lookup
- DB entity lookup

### Is it just Swift `lazy` property identifier?

No, `lazy` property identifier of Swift is a one-time only initialization. Once it's nil, it always nil.

### Implementation
The implementation is surprisingly tedious since Swift property cannot access backing instance (like `_property`), we need an extra property for backing storage.

We then extract the getter part as a function out of the property.

Here's the sample code:
```swift
   var lazyAndHeavyProperty: URL? {
        // if lazyAndHeavyPropertyStorage is nil, will look up for updating value
        get {
            if lazyAndHeavyPropertyStorage == nil {
                lazyAndHeavyPropertyStorage = lazyAndHeavyPropertyLookUp()
            }
            
            return lazyAndHeavyPropertyStorage
        }
    }
    
   fileprivate var lazyAndHeavyPropertyStorage: URL?

   fileprivate func lazyAndHeavyPropertyLookUp() -> URL? {
        if conditionMet {
            ...
            return URL
        }
        return nil
    }
```
