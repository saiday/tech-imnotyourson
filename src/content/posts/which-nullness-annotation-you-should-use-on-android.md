---
title: "Which nullness annotation you should use on Android?"
slug: "which-nullness-annotation-you-should-use-on-android"
date: "2018-04-04T19:04:57.000Z"
description: "I noticed that calling some Android SDK method from Kotlin I got instead of null-safety type even Android SDK file contains annotation. Then I found annotation..."
tags: ["android", "Kotlin"]
draft: false
---

I noticed that calling some Android SDK method from Kotlin I got [Platform Type](https://kotlinlang.org/docs/reference/java-interop.html#null-safety-and-platform-types) instead of null-safety type even Android SDK `.java` file contains `@Nullable` annotation.  
Then I found `@Nullable` annotation is stripped off when compiled into bytecode because Android SDK using `android.annotation.Nullable` which is hidden from API ([AOSP Nullable](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/annotation/Nullable.java#40)).

OK, `android.annotation.Nullable` is for internal usage only.

Here comes the question. Which package of `@Nullable` should I use on Java code?
We have JetBrains's `org.jetbrains.annotations.Nullable` 、 JDK's `javax.annotation.Nullable` and Android's `android.support.annotation.Nullable`. There are a lot more ...

##### Conclusion
Use `android.support.annotation.Nullable` on Android because Android Studio's Lint tool only looks for it.

If you're not targeting Android, you have to check which nullness annotation your linter used if you had any.

###### Story from Kotlin
Kotlin dev team struggled on the same issue. Null-safety types and Java interoperability are like trying to have your cake and eat it too.
Kotlin team tried many approaches and ended up at checking every nullness annotations on the market and infer appropriate null-safety type. Leaving platform type if there's no annotation, you take full control on it.

Ref: [More Null-safety for Java](https://blog.jetbrains.com/kotlin/2015/04/upcoming-change-more-null-safety-for-java/)
