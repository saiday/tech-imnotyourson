---
title: "Lightweight Core Data Migration of RestKit"
slug: "lightweight-core-data-migration-of-restkit"
date: "2014-01-24T13:59:30.000Z"
description: "ref: Core Data’s Lightweight migration is a great feature, use it whenever possible. is sitting on top of Core Data, and RestKit make Core Data Migration..."
tags: ["iOS", "Core Data", "OSX"]
draft: false
---

ref: [RAYWENDERLICH's Core Data Migration tutorial](http://www.raywenderlich.com/27657/how-to-perform-a-lightweight-core-data-migration)

> Core Data’s Lightweight migration is a great feature, use it whenever possible.  
[RestKit](http://restkit.org/)  is sitting on top of Core Data, and RestKit make Core Data Migration simpler than original.

 
### The few things we have to do is:

- Select `.xcdatamodeld` file and choose `Editor > Add Model Version`
- If there were Entity or Attribute renamed, refering to the old data from `renaming ID` field


Give a glance at my code, there's a bit differnt from Pure Core Data because of  `RKManagedObjectStore`.

<script src="https://gist.github.com/saiday/8645235.js"></script>
