---
title: "Mobile and  Web engagement strategies"
slug: "mobile-web-friendly"
date: "2017-03-21T15:02:45.000Z"
description: "Native app integrate with website.
Deep link, App Indexing, Open in app, iOS Spotlight, Android Intents, iOS Universal Links."
tags: ["Deep Link", "App Indexing", "Open in app", "Spotlight", "Intents", "Universal Links", "Web"]
draft: false
---

Making a native app, publish it on app stores. That's it?

Is there anything we can do to reach audience or enhance mobile user's experience?
Rather than rough-and-tumble advertising, we can do these things and being elegant.

This post will focus on blending web and app together. 

#### App indexing (iOS / Android)
How can app be index by search engine?
We can provide metadata describe relationship with our app and website, so that Google can index our app's content.

More than that, we got promoted if user search on mobile web. They can install it or navigate to installed app on search results. 

[App Indexing](https://firebase.google.com/docs/app-indexing/)

#### Deep links (iOS / Android)
Deep link is such a valuable feature of your app.

Register your URL scheme on both iOS and Android. 
They should use exactly same URL scheme and path on same content since you don't know which OS been using when user navigate to the URL.

e.g.
`myscheme://content/8865/`
#### Open in app UI (Web)
I highly recommend this UI over app banners, not even alert dialog with timeout. The button's `a href` value is your content's deep link or app store link if deep link not response.
![](/content/images/2017/03/Image-uploaded-from-iOS-1.jpg)

#### CoreSpotlight (iOS)
Not only can index our app content in iOS Spotlight, we can also use NSUser​Activity APIs to mark an activity as public, which means that it can be shown to other users and can help encourage them to use your app.

[CoreSpotligh](https://developer.apple.com/reference/corespotlight)

#### Intents (Android)
We can do more with Android intents on Android devices, if user installed our app and browser to a dedicated URL we just registered, user will be ask if they want to open in app instead.

This should be done in `AndroidManifest.xml`.

[Code Snippet](https://gist.github.com/saiday/e3c6727e183fe2021c4361afea5e002a)

#### Universal links (iOS)
I don't see many app implemented Universal Links but [Medium](https://medium.com), their content is perfect fit for Universal Links.
When user tapped links on Social Network Services, navigate to native app seamlessly, make it a great experience. 

If you app is not as functional as your website, do not do it, it's frustrated to find a way to fallback to website if they can only see simplified content or cannot configure things that website can.

[Support Universal Links](https://developer.apple.com/library/prerelease/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html)
