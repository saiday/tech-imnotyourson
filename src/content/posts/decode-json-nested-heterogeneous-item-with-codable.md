---
title: "Decode JSON nested heterogeneous item with Codable"
slug: "decode-json-nested-heterogeneous-item-with-codable"
date: "2020-04-30T10:40:31.000Z"
description: "Before all, calm down and think thoroughly If you're trying to decode JSON nested heterogeneous item on , you may probably want to do it with manual decoding..."
tags: ["Swift", "Codable", "Heterogeneous"]
draft: false
---


#### Before all, calm down and think thoroughly
If you're trying to decode JSON nested heterogeneous item on `Codable`, you may probably want to do it with manual decoding instead.
Even though we can decode it with `Codable` without any problem but write your own manual decoding rules could be more intuitive and have better performance.

Ref: [Benchmarking Codable JSONDecoder vs. JSONSerialization... FIGHT!](https://flight.school/articles/benchmarking-codable/)

Despite the above, `Codable` is fun so let's continue anyway.

#### Restriction
In the context of heterogeneous decoding, it's natural to design the polymorphic structure for decoding type purposes. Here comes the restriction: Swift `Codable` implementations do not write out subclass type information, the `decode()` method only static concrete type in the compile-time which means we would lose subclass type information during `decode()`.

Ref: [SwiftSR-5331 Swift 4 Decodable Loses Subclass Type Information](https://bugs.swift.org/browse/SR-5331)

The restriction limits our encapsulation approaches.

#### Solution

Let's say we're trying to decode this JSON data.
```json
{
   "results":[
      {
         "blah":"blah",
         "nested_object":{
            "type":"a",
            "id":69,
            "aVar":"aaa"
         }
      },
      {
         "blah":"blah",
         "nested_object":{
            "type":"b",
            "id":42,
            "bVar":"bbb"
         }
      }
   ]
}
```

<script src="https://gist.github.com/saiday/81a6f9bc2971032d3137453e2a33f345.js"></script>

`HeterogeneousClassFamily` is designed for expandability.  
The business logic of heterogeneous decoding strategy all encapsulate in `HeterogeneousClassFamily`.
