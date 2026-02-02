---
title: "Google Play review monitor - Jon Snow"
slug: "google-play-review-monitor-jon-snow"
date: "2016-05-02T06:11:58.000Z"
description: "I made a service that imitating review monitor - Crawling Google Play reviews and send latest reviews into your slack channel. Host on Heroku by one click You..."
tags: ["Google Play", "Go", "Review", "Slack", "Bot"]
draft: false
---

I made a service that imitating [LaunchKit](launchkit.io) review monitor - [JonSnow](https://github.com/saiday/JonSnow)

![](/content/images/2016/05/screenshot.png)


Crawling Google Play reviews and send latest reviews into your slack channel.

Host [JonSnow](https://github.com/saiday/JonSnow) on Heroku by one click [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/saiday/J    onSnow&env[JON_SNOW_LOCATION]=en)
You have to setup cron job on Heroku dashboard web page, see details on [README](https://github.com/saiday/JonSnow/blob/master/README.md)

Since this service use only one dyno and default postgres database, it's under Heroku free app limitations. Great!
