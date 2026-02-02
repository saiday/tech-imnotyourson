---
title: "Callback delegate, block and chaining"
slug: "when-to-use-delegates-callbacks-or-callback-chaining"
date: "2015-12-10T14:48:20.000Z"
description: "When writing an iOS application, it's too frequently we wait until event has sent, e.g., async operation has finished, network request has responded, view has..."
tags: ["iOS", "Callback", "Block", "Delegate", "Chaining"]
draft: false
---

When writing an iOS application, it's too frequently we wait until event has sent, e.g., async operation has finished, network request has responded, view has been clicked.
There're two major types of callback methodology:  
1. Delegate
2. Block

Which pattern should I adopt when I designing my own callbacks, this has been a difficult decision to make between `Delegate` and `Block` when i was a junior. Now I got my best practice. 

#### Delegate
iOS developers should familiar with delegate, because delegate is the primary way that UI events are implemented in CocoaTouch. Although there is a popular repository [BlocksKit](https://github.com/zwaldowski/BlocksKit) in GitHub, I believe Apple still does it a right way.
> The main value of delegation is that it allows you to easily customize the behavior of several objects in one central object. *From Apple developer library [Delegation](Delegation)*

###### Views
I use delegate pattern for almost all my views, hence my View Controller is the delegate of lots delegating objects (In this case, views). In View Controller we handling UI events from view (such as touch event) and determining states of view. Just like what View Controller should be, a coordinator.

###### Repeating events
Delegate pattern match perfectly with repeating events, for instance, a repeatable API endpoint request with modified parameters: paginator.
Delegate object simply needs to know  there's a bunch of data or objects been loaded and it's time to handle it.

###### Delegate variants - Data source
A data source is almost identical to a delegate. The difference is in the relationship with the delegating object. Instead of being delegated control of the user interface, a data source is delegated control of data.

**Implement delegate the right way**
<script src="https://gist.github.com/saiday/f16b9fc2d89cffe53294.js"></script>
<script src="https://gist.github.com/saiday/2ec1595aaca641972fca.js"></script>
Note: Delegates should never use strong attribute. That can lead to a retain cycle.

#### Block
Block is an elegant solution for one time job callbacks, especially async task. Block can be anonymous or named, depends whether it reuse or not.

###### Computation
For instance, computing the [FFT (Fast Fourier Transform)](https://www.wikiwand.com/en/Fast_Fourier_transform) for some data, add completion and failure callback block is well suited. In this case, we use anonymous block.

###### One time network request
When performing a certain network request, the most readable way is attaching our callback block just after the request. Unlike computation callback block above, it's likely we can use named block in network case, at lease error handling block can be reused.

**Implement block the right way**
<script src="https://gist.github.com/saiday/057d09313ec1785b5be5.js"></script>
<script src="https://gist.github.com/saiday/d54e139a088eb876a878.js"></script>
Note: If you could reference self inside block, use variable qualifiers `__weak` of self. If not, that can lead to self-block retain cycle. (Because blocks will retain any objective c values that are captured when they are created.)
Again, [libextobjc](https://github.com/jspahrsummers/libextobjc) had two useful marcos `@weakify` and `@strongify`, it prevent writing ugly weakSelf alias.

#### Callback chaining

In some cases, we have to deal with dependent async tasks. A real-life example is we need to know what `userId` is before we get `userFollowersCount` from two isolated API endpoints. The input of secondary request is the output of the primary request.
If we handle this case in `Delegate` way, the code looks a bit scattered. If we handle this case in `Block` way, the dependency of those two requests really clear and readable, but what if we add more dependencies after it? The Nested Blocks becomes [Pyramid of doom](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)).

There are several frameworks out there can do callback chaining very well.  

- [ReactiveCocoa](https://github.com/ReactiveCocoa/ReactiveCocoa) The concept of ReactiveCocoa is [Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming).  
Simple example:
<script src="https://gist.github.com/saiday/767849b0a561079de06c.js"></script>

- [PromiseKit](https://github.com/mxcl/PromiseKit) The concept of PromiseKit is [Futures and promises](https://en.wikipedia.org/wiki/Futures_and_promises)
.  
Simple example took from [PromiseKit doc](http://philmitchell.github.io/PromiseKit/)
<script src="https://gist.github.com/saiday/27a049e10f0961b15358.js"></script>

- [Bolts-iOS](https://github.com/BoltsFramework/Bolts-iOS) The concept of Bolts is `BFTask` which returned from an asynchronous function and gives the ability to continue processing the result of the task.  
Bolts GitHub [README](https://github.com/BoltsFramework/Bolts-iOS/blob/master/README.md) provides good examples.

- [RxSwift](https://github.com/ReactiveX/RxSwift) (Swift only), Swift version of powerful [Reactive Extensions](http://reactivex.io/).
<script src="https://gist.github.com/saiday/88530a3575a9d3f01e4d.js"></script>


These frameworks create signal/promise/task/stream called in sequence, chained together. This is what called callback chaining.

Currently I use Objective C as my primary iOS language over Swift. Hence I prefer ReactiveCocoa, but using PromiseKit in some of my side projects, PromiseKit is a light-weight elegant solution. If I going to Swift, RxSwift is my first choice. Because I'm an Android developer as well.
