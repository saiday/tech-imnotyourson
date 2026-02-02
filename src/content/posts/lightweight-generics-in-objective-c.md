---
title: "Lightweight Generics in Objective-C"
slug: "lightweight-generics-in-objective-c"
date: "2018-05-06T18:35:01.000Z"
description: "Except for Swift interoperability, using lightweight generics can make your Objective-C code more readable and self-inspection. Lightweight generics was..."
tags: ["Objective C"]
draft: false
---

Except for Swift interoperability, using lightweight generics can make your Objective-C code more readable and self-inspection.

Lightweight generics was introduced in WWDC 2015, they named it **lightweight** because this feature isn't from Objective-C runtime upgrade but from LLVM support.

---

##### Collections
```objc
NSArray<NSString *> *strings = @[@"oh", @"ok"];
NSDictionary<NSString *, NSNumber *> *map = @{@"1": @1, @"2": @2};
NSSet<NSString *> set = [NSSet setWithArray:@[@"oh", @"ok"]];
```
Specifying type information at collections would generate typed Swift interfaces, other than that, you now had improved readability, type information at auto-completion hints and compiler warning.

---

##### __kindof
```objc
NSArray<UIView *> *array1;
NSArray<__kindof UIView *> *array2;
    
UIButton *button1 = array1.firstObject; // Incompatible pointer types initializing 'UIButton *' with an expression of type 'UIView * _Nullable'
UIButton *button2 = array2.firstObject // Fine
```

If you store subtypes in a collection without `__kindof` and retrieve it without casting you would get compiler warning.

---

##### Custom generic types
```objc
@interface Stack<__covariant T> : NSObject
- (void)pushObject:(T)object;
- (T)popObject;
@property (nonatomic, readonly) NSArray<T> *allObjects;
@end
```

The `__covariant` is to indicate that subtypes are acceptable. There is also `__contravariant` tag.
They are similar to `<? extends T>` and `<? super T>` in Java.


---

References:
1. [Using Swift with Cocoa and Objective-C (Apple)]( https://developer.apple.com/library/content/documentation/Swift/Conceptual/BuildingCocoaApps/InteractingWithObjective-CAPIs.html#//apple_ref/doc/uid/TP40014216-CH4-ID173)
2. [Using Objective-C Lightweight Generics](https://useyourloaf.com/blog/using-objective-c-lightweight-generics/)
3. [2015 Objective-C 新特性](https://blog.sunnyxx.com/2015/06/12/objc-new-features-in-2015/)
