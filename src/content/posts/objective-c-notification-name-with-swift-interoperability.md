---
title: "Objective-C Notification.Name with Swift interoperability"
slug: "objective-c-notification-name-with-swift-interoperability"
date: "2020-01-02T13:57:49.000Z"
description: "name has evolved from Objective-C's plain type to a dedicated type, which is succinct and intuitive. My project is still in the state of mixed Objective-C and..."
tags: ["Objective C", "Swift"]
draft: false
---

`NSNotification` name has evolved from Objective-C's plain `NSString` type to a 
dedicated `Notification.Name` type, which is succinct and intuitive.

My project is still in the state of mixed Objective-C and Swift. 
I accidentally found a LLVM glamour (correct me if I'm wrong!) that handles **old Objective-C notification names** been used with **new Swift NotificationCenter observer names** with perfect interoperability.

If your Objective-C notification names are named this style:

```objc
// ObjCFile.h
extern NSString *const kSomeNotification;
// ObjCFile.m
NSString *const kSomeNotification = @"kSomeNotification";
```
<br>
Build your project, you now have a `Notification.Name.some` type LLVM generated for you: 
```swift
NotificationCenter.default.addObserver(self, selector: #selector(someSelector), name: Notification.Name.some, object: nil)
```
<br>

If you follow certain Objective-C Notification name naming convention revealed below, you don't have to change a bit of your codebase and Swift is ready to use all Notification identifiers defined in Objective C.


#### Objective-C Notification name naming convention

The convention I found out is when Objective-C `.h` file has a `NSString` typed field with `Notification` suffix, LLVM would pick it and generate a corresponding Swift `Notification.Name` type. 

Have you noticed that `k` prefix from Objective-C field (which is a constant field naming convention used by C developers) is ripped off at the Swift `Notification.Name` type.  This is mesmerized.

The `Notification` suffix was formally recommended by Apple. 
> [Name of associated class] + [Did | Will] + [UniquePartOfName] + **Notification**
> For example:
> 
> NSApplicationDidBecomeActiveNotification
NSWindowDidMiniaturizeNotification
NSTextViewDidChangeSelectionNotification
NSColorPanelColorDidChangeNotification 
> 
> from [Naming Properties and Data Types
](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CodingGuidelines/Articles/NamingIvarsAndTypes.html)


###### Formats
The essential rules are `NSString` typed and `Notification` suffix, nothing else.
So it could be any of the formats:  
```objc
extern NSString *const kSomeNotification;
NSString *const kSomeNotification;
NSString *someNotification;
```
