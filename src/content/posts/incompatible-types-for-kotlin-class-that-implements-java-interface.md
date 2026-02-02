---
title: "“Incompatible types” Calling Kotlin class with generic interface from Java"
slug: "incompatible-types-for-kotlin-class-that-implements-java-interface"
date: "2018-04-24T13:55:38.000Z"
description: "I believe calling Kotlin class which implements Java generic interface from Java is buggy for type checking. My solution is to get rid of Java, it works fine..."
tags: ["Kotlin"]
draft: false
---

```java
// Interface from Java
public interface JavaInterface<T> {
    void process(T var1);
}

// Class from Kotlin
class  KotlinClass : JavaInterface<List<String>> {
    override fun process(params: List<String>) {
        ...
    }
}

// Calling Kotlin class from Java
public class JavaClass {
    public static JavaInterface<List<String>> method() {
          return new KotlinClass();
          // ERROR: KotlinClass cannot be converted to JavaInterface<List<String>>
    }
}

```

I believe calling Kotlin class which implements Java generic interface from Java is buggy for type checking.

My solution is to get rid of Java, it works fine on pure Kotlin.

Tested on Kotlin `1.2.10`, `1.2.40` version.
