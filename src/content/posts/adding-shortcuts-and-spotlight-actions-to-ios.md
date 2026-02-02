---
title: "Adding Shortcuts and Spotlight actions to iOS"
slug: "adding-shortcuts-and-spotlight-actions-to-ios"
date: "2026-01-17T16:35:23.000Z"
description: "Let's say, I want a “Shuffle Liked Songs” action that: - shows in Spotlight - shows in the Shortcuts app - opens the app and runs the action Implementation:..."
tags: []
draft: false
---

Let's say, I want a “Shuffle Liked Songs” action that:

- shows in Spotlight
- shows in the Shortcuts app
- opens the app and runs the action



### Implementation: App Intents

Define the intent:
```swift
struct ShuffleLikesIntent: AppIntent {
    static let title: LocalizedStringResource = "Shuffle Liked Songs"
    static let description = IntentDescription("Your favorite songs deserve another spin")
    static let openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult {
        guard
            let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let delegate = scene.delegate as? SceneDelegate
        else { return .result() }

        delegate.performShuffleLikesAction()
        return .result()
    }
}

func performShuffleLikesAction() {
    ...
}
```
Notes:
`openAppWhenRun = true`, `@MainActor` if UI navigation required.

Register the shortcut:
```swift
struct ShortcutsProvider: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: ShuffleLikesIntent(),
            phrases: [
                "Shuffle my likes in \(.applicationName)",
                "Play my likes in \(.applicationName)"
            ],
            shortTitle: "Shuffle Liked Songs",
            systemImageName: "shuffle"
        )
    }
}
```


#### Reminder
If you define “action” in both [NSUserActivity](https://developer.apple.com/documentation/foundation/nsuseractivity) with `isEligibleForPrediction ` and [App Intents](https://developer.apple.com/documentation/appintents), Shortcuts action can show duplicates.
