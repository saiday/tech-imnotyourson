---
title: "MockitoConfiguration if using Retrofix + RxJava"
slug: "mockito-configuration"
date: "2018-01-27T16:35:33.000Z"
description: "What is ? Use it to configure Mockito. For now there are not many configuration options but it may change in future. In most cases you don't really need to..."
tags: ["android", "Mockito", "RxJava", "Retrofit"]
draft: false
---

##### What is [MockitoConfiguration](https://static.javadoc.io/org.mockito/mockito-core/2.7.9/org/mockito/configuration/IMockitoConfiguration.html)?
> Use it to configure Mockito. For now there are not many configuration options but it may change in future.
In most cases you don't really need to configure Mockito. For example in case of working with legacy code, when you might want to have different 'mocking style' this interface might be helpful. A reason of configuring Mockito might be if you disagree with the Answers.RETURNS_DEFAULTS unstubbed mocks return.



##### Why I need a custom MockitoConfiguration?

To wrap and return an `Observable` which throws `RuntimeException` on Mock object methods invocation which used to return `Observable`.

Mock object method invocation returns `null` as default, if we are not handling it right ( `Observable` stubbed) we get `NullPointerException` on follow-ups `subscribe()` call.

##### Create your own MockitoConfiguration
> To configure Mockito create exactly `org.mockito.configuration.MockitoConfiguration` class that implements this interface.

You have to define the Mockito package in your test module. Mockito loads this class using reflection, the class would marked as unused since it's runtime available.

example:
<script src="https://gist.github.com/saiday/1005a16ef31abedadd2db65301753783.js"></script>



Therefore we don't have to stub any `Observable`.
