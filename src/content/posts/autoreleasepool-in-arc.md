---
title: "@autoreleasepool in ARC"
slug: "autoreleasepool-in-arc"
date: "2014-01-24T15:38:46.000Z"
description: "Say it openly, since I started iOS development I have used ARC. Here are questions: 1. Is really matters when ARC enabled? 2. Doesn't ARC handles the memory..."
tags: ["iOS", "autoreleasepool"]
draft: false
---

Say it openly, since I started iOS development I have used ARC. 

Here are questions: 
1. Is `@autoreleasepool` really matters when ARC enabled? 
2. Doesn't ARC handles the memory management for us?

#### Yes, because we care about memorys.
#### ARC means the compiler inserts retains and releases in all the places you should have anyway. That's it. ARC isn't GC as we all known.

-----

> Autorelease just removes a retain count from the object it does not "free" the memory immediately like in c. When the autorelease pool ends all auto released objects with a count of 0 will have their memory freed up. [@Kibitz503](http://stackoverflow.com/users/789848/kibitz503)

Sometimes we create a lot of objects. Those objects are One-Time Usage and will want to free up memory used by those. 
We should put these parts of code into `@autoreleasepool` instead of waiting for it to be freed naturally.

Samples from [@Kibitz503](http://stackoverflow.com/users/789848/kibitz503) again:

```objc
//Non Arc Env
@autoreleasepool 
{

    MyObject *obj = [[MyObject alloc] init]; // no autorelease call here
    //Since MyObject is never released its a leak even when the pool exits

}
//Non Arc Env
@autoreleasepool 
{

    MyObject *obj = [[[MyObject alloc] init] autorelease]; 
    //Memory is freed once the block ends

}
// Arc Env
@autoreleasepool 
{

    MyObject *obj = [[MyObject alloc] init]; 
    //No need to do anything once the obj variable is out of scope there are no strong pointers so the memory will free

}

// Arc Env
MyObject *obj //strong pointer from elsewhere in scope
@autoreleasepool 
{

    obj = [[MyObject alloc] init]; 
    //Not freed still has a strong pointer 

}
```
