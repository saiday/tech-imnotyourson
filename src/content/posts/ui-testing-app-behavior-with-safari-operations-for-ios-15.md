---
title: "UI testing app behavior with Safari operations for iOS 15"
slug: "ui-testing-app-behavior-with-safari-operations-for-ios-15"
date: "2022-03-06T08:02:19.000Z"
description: "Personally I'm not a huge fan of UI Tests, but in some cases it's the only solution for us to test essential functions of our app. With the help with UI Tests..."
tags: ["Testing", "UI Testing"]
draft: false
---

Personally I'm not a huge fan of UI Tests, but in some cases it's the only solution for us to test essential functions of our app.
With the help with UI Tests we are able to test Deep Link, Universal Link on the testing process.

This post focus on Safari operations with UI tests hence for Deep Link.

The most tricky part of Safari on UI Testing is unpredictable "What's new" pop-up and keyboard tutorial on very first typing attempt.

Handling "What's new" pop-up:

```swift
// Safari sometimes shows a "What's new" screen, which we treat by first finding and tapping the "Continue" button
let firstLaunchContinueButton = safari.buttons["Continue"]
if firstLaunchContinueButton.exists {
    firstLaunchContinueButton.tap()
}
```


Handling keyboard tutorial:
```swift
// Keyboard Tutorial can also happen when opening the keyboard for the first time.
let safariContiuneButtonQuery = safari.buttons.matching(identifier: "Continue")
// first: Safari search now shows personalized suggestion from the web, .... [Continue]
// second: Speed up your typing by sliding your finger ... [Continue] <-- one-time displaying
if safariContiuneButtonQuery.count == 2 {
    let keyboardTutorialContinueButton = safariContiuneButtonQuery.element(boundBy: 1)
    keyboardTutorialContinueButton.tap()
}
```


Raw setup:
<script src="https://gist.github.com/saiday/4f6f6bd6ecf91ebe5ea3f9eb7467c8ef.js"></script>
