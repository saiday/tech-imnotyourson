---
title: "Upgrading and Releasing New Pod Versions on CocoaPods"
slug: "release-new-versions-of-pod-on-cocoapods"
date: "2025-01-23T06:52:14.000Z"
description: "This guide assumes you already maintain a pod and are one of its authors. If not, start here: . I don’t release new pod versions very often, and I tend to..."
tags: []
draft: false
---

This guide assumes you already maintain a pod and are one of its authors. If not, start here: [Getting set up with Trunk](https://guides.cocoapods.org/making/getting-setup-with-trunk.html).

I don’t release new pod versions very often, and I tend to forget the exact steps—so this is a note to myself.

### Upgrade pod on CocoaPods
1. Update the `.podspec` file for s.version and s.source with the new git tag.
2. Create a new git tag.
3. Push the `.podspec` commit and tag to the remote.
4. Run `pod spec lint --allow-warnings`.
5. Run `pod trunk register mail@example.com 'Name'` for verifing the session.
6. Run `arch -x86_64 pod trunk push --allow-warnings`.

##### Fetch newly updated pods on local environment
> [CocoaDocs](http://cocoadocs.org/) receives notifications from the [CocoaPods/Specs](https://github.com/CocoaPods/Specs) repo on GitHub whenever a CocoaPod is updated. This process can take around 15 minutes after your Podspec is merged.   
>from:[How do I get my library on CocoaDocs?](https://guides.cocoapods.org/making/specs-and-specs-repo.html#how-do-i-get-my-library-on-cocoadocs)


Run `arch -x86_64 pod repo update`.

That’s it. Happy upgrading!
