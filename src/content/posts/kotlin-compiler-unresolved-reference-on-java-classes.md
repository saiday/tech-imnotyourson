---
title: "Kotlin compiler unresolved reference on Java classes"
slug: "kotlin-compiler-unresolved-reference-on-java-classes"
date: "2018-01-04T11:54:58.000Z"
description: "Some Java classes cannot be loaded by Kotlin compiler. TL;DR; If you compile your Java + Kotlin mixed code then get such errors. You probably need to check..."
tags: ["JVM", "Kotlin", "Java"]
draft: false
---

```
Unresolved reference: JavaClass1
Unresolved reference: JavaClass2
Unresolved reference: JavaClass3
Unresolved reference: JavaClass4
Unresolved reference: JavaClass5
Unresolved reference: JavaClass6
Unresolved reference: JavaClass7
...
```

Some Java classes cannot be loaded by Kotlin compiler.

###### TL;DR;
If you compile your Java + Kotlin mixed code then get such errors. You probably need to check your Java source file's path.

#### General JVM Class Loader
In Java, it requires you to put class source file in the corresponding directory of it's package statement.
In Kotlin, you can put class source file anywhere regardless of the package they're in,

The difference of compilers feature.

#### Mixed compiling
Kotlin compiler would be invoked before Java compiler, and Kotlin have a little bit restricted Java Class Loader.

It's ok for Java compiler to load class `A` from package `com.dummy.path.model` in such directories graph:

```
- com
  - dummy.path
    - model
      - A.java
```

Kotlin compiler would not resolve class `A` in above directories graph, it's restricted to be one directory per path. See below:

```
```
- com
  - dummy
    - path
      - model
        - A.java
```


I agree with Kotlin compiler's implementation.
Since this issue is hard to identify, this article may make someone's life easier. 


Ref:
[The Class Loader Subsystem (The Java Virtual Machine by Bill Venners)](http://www.artima.com/insidejvm/ed2/jvm4.html)
