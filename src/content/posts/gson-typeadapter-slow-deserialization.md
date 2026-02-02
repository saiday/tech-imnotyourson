---
title: "Gson TypeAdapter slow deserialization"
slug: "gson-typeadapter-slow-deserialization"
date: "2019-01-02T11:04:56.000Z"
description: "If you have been using Gson's TypeAdapter you might want to check your TypeAdapter's constructer to see if it causing performance issue. Recently I received a..."
tags: ["android", "Retrofit", "Gson", "deserialization", "TypeAdapter"]
draft: false
---

If you have been using Gson's TypeAdapter you might want to check your TypeAdapter's constructer to see if it causing performance issue.

Recently I received a report about the slow request on specified API endpoint.  
Found out it was a performance issue on Gson deserialization, it took **3.059 seconds** to deserialize a **3 KB** JSON contains **30 objects** in structure.

**3 seconds** on deserialization, INSANE.

#### The problem
original TypeAdapter definition and registration:

```java
public class GenericItemDeserializer implements JsonDeserializer<GenericItem> {

    @Override
    public GenericItem deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        Gson gson = new Gson();
        GenericItem item = null;
        
        ...

        return item;
    }
}
```

```java
GsonBuilder gsonBuilder = new GsonBuilder();
gsonBuilder.registerTypeAdapter(GenericItem.class, new GenericItemDeserializer());
return gsonBuilder.create();
```

#### The cause
Gson would create new `TypeAdapter` instance on each mapping process.

If you're an experienced developer, you might notice we initial new `Gson` instance on each `TypeAdapter`. What if Gson initialization is a resource consuming task?
It is.

#### The fix

Caching `Gson` instance at Gson builder. 
In my case, deserialization time reduced from **3.059** to **0.072**, which is a **420%** boost.

```java
public class GenericItemDeserializer implements JsonDeserializer<GenericItem> {
    private Gson gson;

    public GenericItemDeserializer(Gson gson) {
        this.gson = gson;
    }

    @Override
    public GenericItem deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        GenericItem item = null;
        
        ...

        return item;
    }
}
```

```java
Gson gson = new Gson();
GsonBuilder gsonBuilder = new GsonBuilder();
gsonBuilder.registerTypeAdapter(GenericItem.class, new GenericItemDeserializer(gson));
return gsonBuilder.create();
```

###### Is it thread-safe then?
Yes, Gson is [thread-safe](https://github.com/google/gson/blob/master/gson/src/test/java/com/google/gson/functional/ConcurrencyTest.java#L33). Just cache it.


##### What about `SimpleDateFormat` at deserialization?
`SimpleDateFormat` initialization is resource consuming as well, though not dramatically impact the performance. But you should avoid it if you can.
Notice that `SimpleDateFormat` is not thread-safe.
