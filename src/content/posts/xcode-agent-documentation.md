---
title: "Xcode ships documentation for AI agents, you should copy it"
slug: "xcode-agent-documentation"
date: "2026-03-20T12:00:00.000Z"
description: "Xcode 26.3 bundles Apple-written documentation specifically for AI agents. Even if you don't use Xcode for coding, these files are gold for any agent-assisted Apple development workflow."
tags: ["xcode", "agent"]
draft: false
---

Xcode 26.3 ships with an AI assistance feature. Since I'm not currently using Xcode itself for developing iOS and macOS apps, the most important thing Xcode ships is Apple's documentation written specifically for AI agents.

I copy these files into my project and ask my agent to read and follow them for the corresponding topics. It's a true gold mine for developers working with AI agents on Apple platforms.

## Where to find them

The documentation lives inside the Xcode app bundle:

```
/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation
```

![Xcode AdditionalDocumentation folder](/content/images/2026/03/xcode-additional-documentation.png)

## What's inside

As of Xcode 26.3, you get 20 markdown files covering a wide range of Apple frameworks and APIs:

### Liquid Glass (iOS 26 Design Language)
- `SwiftUI-Implementing-Liquid-Glass-Design.md` — Implementing Liquid Glass effects in SwiftUI
- `UIKit-Implementing-Liquid-Glass-Design.md` — Implementing Liquid Glass effects in UIKit
- `AppKit-Implementing-Liquid-Glass-Design.md` — Implementing Liquid Glass effects in AppKit
- `WidgetKit-Implementing-Liquid-Glass-Design.md` — Implementing Liquid Glass effects in WidgetKit

### Swift Language
- `Swift-Concurrency-Updates.md` — Swift 6.2 concurrency and data-race safety updates
- `Swift-InlineArray-Span.md` — InlineArray and Span types for performance

### SwiftUI
- `SwiftUI-New-Toolbar-Features.md` — New toolbar APIs and customization
- `SwiftUI-Styled-Text-Editing.md` — Styled text editing support
- `SwiftUI-WebKit-Integration.md` — WebKit integration in SwiftUI
- `SwiftUI-AlarmKit-Integration.md` — AlarmKit integration in SwiftUI

### Frameworks
- `FoundationModels-Using-on-device-LLM-in-your-app.md` — Apple's on-device LLM framework (Foundation Models)
- `Foundation-AttributedString-Updates.md` — AttributedString API updates
- `AppIntents-Updates.md` — App Intents framework updates
- `StoreKit-Updates.md` — StoreKit API updates
- `SwiftData-Class-Inheritance.md` — SwiftData class inheritance support
- `MapKit-GeoToolbox-PlaceDescriptors.md` — MapKit GeoToolbox and PlaceDescriptors
- `Swift-Charts-3D-Visualization.md` — Swift Charts 3D visualization

### Platform Features
- `Implementing-Visual-Intelligence-in-iOS.md` — Implementing Visual Intelligence in iOS
- `Implementing-Assistive-Access-in-iOS.md` — Implementing Assistive Access in iOS
- `Widgets-for-visionOS.md` — Building widgets for visionOS

