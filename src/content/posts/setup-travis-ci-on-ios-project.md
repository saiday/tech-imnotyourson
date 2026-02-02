---
title: "Setup Travis CI on iOS project"
slug: "setup-travis-ci-on-ios-project"
date: "2015-04-10T09:15:59.000Z"
description: "Recently I set up a continuous integration service for my iOS project. There are a couple of hosted continuous integration tool(server) options for me: 1. 3. I..."
tags: ["iOS", "TravisCI", "Slather", "Coveralls", "Testing"]
draft: false
---

Recently I set up a continuous integration service for my iOS project. There are a couple of hosted continuous integration tool(server) options for me:
1. [Travis CI](https://travis-ci.org/)
3. [Jenkins](https://jenkins-ci.org/)

I choose Travis CI in the end. In brief, I merely want CI service to build, run tests, calculate test coverages and deploy to iTunes Connect for me, get rid of these repeating handcrafted works. CI is there to helps, automatically and remotely.
Hence, setting up and maintaining a Jenkin server takes too much effort.

### Sign up Travis CI, GitHub project integration, Enable repository for testing.
You know what I mean.

### Add .travis.yml
<script src="https://gist.github.com/saiday/4524919bd0adf4422a80.js"></script>

I tried original xcodebuild and [xcpretty](https://github.com/supermarin/xcpretty), it builds slower than [xctool](https://github.com/facebook/xctool) for me. And I prefer [xctool](https://github.com/facebook/xctool) styles, so I go for xctool.

I installed [slather](https://github.com/venmo/slather) at `before_install`, [slather](https://github.com/venmo/slather) is response for sending test coverage reports to [Coveralls](https://coveralls.io/). It needs `.slather.yml` as well.
<script src="https://gist.github.com/saiday/98fe84e2e256436d74f0.js"></script>

It's all done.

![](/content/images/2015/Apr/Screenshot_2015_04_10_17_08_56.png)

![](/content/images/2015/Apr/Screenshot_2015_04_10_17_14_05.png)
