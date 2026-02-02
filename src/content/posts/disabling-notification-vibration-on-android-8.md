---
title: "Disabling notification vibration on Android 8"
slug: "disabling-notification-vibration-on-android-8"
date: "2018-06-07T09:42:02.000Z"
description: "NotificationChannel had a bug which is vibration cannot be disabled normally.
You've implemented the tricks above, but your notification vibrates still?"
tags: ["android", "notification"]
draft: false
---

Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel or it will not appear.
[NotificationChannel](https://developer.android.com/reference/android/app/NotificationChannel) is a new notification feature on Android 8. Unfortunately, it had a bug which is vibration cannot be disabled **normally**.

The trick is enabling vibration and setting empty pattern. 
```java
NotificationChannel channel = new NotificationChannel("id", "name", NotificationManager.IMPORTANCE_LOW);
channel.setVibrationPattern(new long[]{ 0 });
channel.enableVibration(true);
```

---

##### Debug tips

You've implemented the tricks above, but your notification vibrates still?

You have created the channel in your application. Once channel is created it cannot be changed. You need to either reinstall the app or create a channel with new channel ID.

All configs applied to `NotificationChannel` is immutable.
