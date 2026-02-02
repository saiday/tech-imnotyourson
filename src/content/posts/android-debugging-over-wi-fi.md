---
title: "Android debugging over Wi-Fi"
slug: "android-debugging-over-wi-fi"
date: "2018-03-01T09:05:59.000Z"
description: "My MacBook cannot serve Huawei Nexus 6P USB cable connection well. What matters is not only it often been disconnected but affect other USB devices. Fucking..."
tags: ["android"]
draft: false
---

My MacBook [USB-C hub](https://innowatt.waca.ec/product/detail/143540) cannot serve Huawei Nexus 6P USB cable connection well.
What matters is not only it often been disconnected but affect other USB devices. 

Fucking annoying.

I had to come up with a solution: connect device over Wi-Fi
1. Connect Android device via cable
2. Execute `adb tcpip 5555` on your dev computer
3. Execute `adb kill-server` on your dev computer
4. Execute `adb connect {device_ip}:5555` on your dev computer
5. Cable-free now

More:
- `adb usb` if you wish to switch back to USB

----
###### adb command details:

###### `tcpip 5555`

restart adb server listening on TCP on 5555 PORT
port 5555 opened across all involved firewalls and debug mode enabled

###### `kill-server`
kill the adb server if it is running

###### `connect {device_ip}:5555`
connect to a device via TCP/IP


Ref:
[USB Host and Accessory](https://developer.android.com/guide/topics/connectivity/usb/index.html)  
[Android Debugging over WiFi](http://mehrvarz.github.io/android-debug-sans-usb/)
