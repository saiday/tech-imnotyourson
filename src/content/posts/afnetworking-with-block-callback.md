---
title: "AFNetworking with block callback"
slug: "afnetworking-with-block-callback"
date: "2013-09-12T17:18:00.000Z"
description: "We all know AFNetworking fetching data asynchronously. Usually it convenient to do things inside completion block, but in some situations we want some more. We..."
tags: ["iOS", "AFNetworking"]
draft: false
---

We all know AFNetworking fetching data asynchronously.
Usually it convenient to do things inside completion block, but in some situations we want some more.

* We have to ask it for something when the data is downloaded.
* Unit testing usage.
* Better code readability.

There's a common philosophy as the author of AFNetworing [Mattt Thompson](https://twitter.com/mattt) said.
> The trick to asynchronous programming is to break the procedural, synchronous assumption that data is there when you ask for it. Instead, with async, when you ask for something, you give it a callback to perform when the data finally is ready.

So, implement a block callback into completion block is what we need to do.

Assume that we have a `Connection` Class, fetching data down, and call another block when data downloaded.

```objc
@interface Connection : NSObject

+ (void)fetchAPI:(void (^)(id json))parser;

@end
```

```objc
@implementation Connection

+ (void)fetchAPI:(void (^)(id json))parser
{
    NSURL *url = [NSURL URLWithString:SODAPI];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
   
    AFJSONRequestOperation *operation = [AFJSONRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, id obj){
        parser(obj);
    }failure:nil];
   
    [operation start];
}
```

Somewhere we really use it.

```objc
    [Connection fetchAPI:^(id json) {
        NSLog(@"data : %@", json);
    }];
```
