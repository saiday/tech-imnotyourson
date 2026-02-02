---
title: "Handling deep link with NSURLProtocol"
slug: "handling-deep-link-with-nsurlprotocol"
date: "2016-12-25T08:52:14.000Z"
description: "is commonly used on request logging. Unlike the normal pattern, this article is about intercepting URI Scheme-based deep linking URL request and provide..."
tags: ["NSURLProtocol", "Scheme", "Deep Link"]
draft: false
---

[NSURLProtocol](https://developer.apple.com/reference/foundation/nsurlprotocol) is commonly used on request logging. 

Unlike the normal pattern, this article is about intercepting URI Scheme-based deep linking URL request and provide corresponding URL response.

#### Problem?

I implemented deep links for my app, I can handle this by `UIApplicationDelegate`'s [application:openURL:options:](https://developer.apple.com/reference/uikit/uiapplicationdelegate/1623112-application) method. **it's fine**.

I implemented [Core Spotlight](https://developer.apple.com/reference/corespotlight), I can handle user result by `UIApplicationDelegate`'s [application:continueUserActivity:restorationHandler:](https://developer.apple.com/reference/uikit/uiapplicationdelegate/1623072-application) method. **well fine then**.

I implemented Push Notification, the notification's custom navigating indication is something like `article/{article_id}`, `settings/{check_for_update}`, have to retrieve data from Push Notification's payload and design a very specific business logic just to handle this. **hmm (a lot of work to do)**

My app introduced some web-based view, inside the web view there are some links that should navigate to app's other UIViewController instead of staying on current web view, the phrase could be `subscribe/{user_id}`, `article/{article_id}`. **Nooo, scattered and tangled code!**


#### [URL Loading System](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/URLLoadingSystem/URLLoadingSystem.html)


URL Loading System is everything we'll need to know about this topic.

>The URL loading system is a set of classes and protocols that allow your app to access content referenced by a URL. At the heart of this technology is the NSURL class, which lets your app manipulate URLs and the resources they refer to.

The URL loading system provides support for accessing resources using the following protocols already:

- ftp://
- http://
- https://
- file://
- data://

We now wanted a custom protocol, let's say `imnotyourson://`.

#### NSURLProtocol
<script src="https://gist.github.com/saiday/d47c2f99b4f823c4bb8b0a7126ee31c1.js"></script>

<script src="https://gist.github.com/saiday/61f138b17e68938906f49e67dc5b708b.js"></script>

Yes, the key point is 
```objc
 NSData *data = [NSKeyedArchiver archivedDataWithRootObject:item];
    NSURLResponse *response = [[NSURLResponse alloc] initWithURL:self.request.URL MIMEType:@"text/plain" expectedContentLength:data.length textEncodingName:nil];
```

The GenericItem implements [NSCoding](https://developer.apple.com/reference/foundation/nscoding) protocol to do the tricks.


#### Results
<script src="https://gist.github.com/saiday/dfcc8024d3870e4fe0a9e31669f14d89.js"></script>

Elegant!
