---
title: "Mockito mocking parameterized class in Kotlin"
slug: "mockito-mocking-parameterized-class-in-kotlin"
date: "2018-04-24T14:23:39.000Z"
description: "If you try to mock parameterized class in Kotlin with Mockito You will get this compiler error: That is because Kotlin's is runtime reference. Since generic..."
tags: ["Kotlin", "Mockito"]
draft: false
---

If you try to mock parameterized class in Kotlin with Mockito
```kotlin
val mockMyClass = mock<MyClass<String>>(MyClass<String>::class.java)
```

You will get this compiler error:
```
only classes are allowed on the left hand side of a class literal
```

That is because Kotlin's [class literal syntax](https://kotlinlang.org/docs/reference/reflection.html#class-references) is runtime reference. Since generic type arguments are not reified at runtime, we can only obtain an object representing a class, not a type.

##### Kotlin inline function as a workaround

You can declare a helper function which substituting parameterized class with the desired type at the call site:
```kotlin
inline fun <reified T: Any> mock() = Mockito.mock(T::class.java)
```
And use it instead of Mockito's:
```kotlin
val mockMyClass: MyClass<String> = mock()
```
