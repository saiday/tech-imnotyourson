---
title: "Xcode 26 hides iOS Simulators? Check EXCLUDED_ARCHS"
slug: "xcode-26-hides-ios-simulator-destinations"
date: "2026-05-25T00:00:00.000Z"
description: "Xcode 26 filters destinations with no buildable arch at enumeration time. A long-standing EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64 from CocoaPods now hides every iOS Simulator on Apple Silicon."
tags: ["xcode", "ios", "cocoapods"]
draft: false
---

Upgrade to Xcode 26 and your project loses every simulator from the destination picker. The dropdown shows only `Any iOS Simulator Device` and so do `xcodebuild`?

```
$ xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -showdestinations
    { platform:iOS Simulator, id:dvtdevice-DVTiOSDeviceSimulatorPlaceholder-iphonesimulator:placeholder, name:Any iOS Simulator Device }
```

Diagnosis:

- `xcrun simctl list devices`: shows every simulator
- `xcrun xctrace list devices`: shows every simulator
- Fresh iOS project on the same Mac and Xcode: shows every simulator
- Your project (both Xcode UI and `xcodebuild`): missing every simulator
- Your porject use CocoaPods as package manager

## The cause

CocoaPods detects vendored binaries that lack an arm64-for-simulator slice and injects this into the aggregate xcconfig:

```
EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64
```

Common triggers are pre-xcframework SDKs that still ship as fat `.a` or fat `.framework`: For me, they are WeChat, Tencent QQ, Geetest, older AliPay, older ad networks. Find yours:

```bash
grep -RIn "EXCLUDED_ARCHS\[sdk=iphonesimulator" Pods/Target\ Support\ Files/
```

Each match points to a pod whose binary triggered the exclude. `lipo -info` on that binary will show something like:

```
Architectures in the fat file: libFoo.a are: armv7 i386 x86_64 arm64
```

The `arm64` slice is for iOS device, not for iOS Simulator. A fat binary cannot carry both, which is why `.xcframework` exists.

Older Xcode let you pick a simulator destination anyway and failed at link time. **Xcode 26 filters destinations with no buildable arch at enumeration time.** Your Apple Silicon Mac only has arm64 simulators. Exclude arm64 and the destination resolver has nothing to show.

## The fix

Shadow the Pods setting at project level. Open `project.pbxproj` and, in every build configuration's settings block, set:

```
"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "";
```

If a line with `= arm64` already exists, change the value to `""`. If not, add it. Project-level settings override the Pods aggregate xcconfig, and the empty value defeats the SDK-conditional exclude.

Same effect from the Xcode UI: Project (not Target) → Build Settings → Excluded Architectures → expand the row → set "Any iOS Simulator SDK" to empty, for each configuration.
