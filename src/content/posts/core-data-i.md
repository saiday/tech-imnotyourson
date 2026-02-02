---
title: "Core Data in iOS 10"
slug: "core-data-i"
date: "2016-11-02T12:40:46.000Z"
description: "Core Data has been highly improved and can be considered generally good in iOS 10. Core Data stack. I believe many developers experienced really bad pain in..."
tags: ["Core Data", "Xcode", "Core Data Stack", "NSPersistentContainer", "codegen"]
draft: false
---

Core Data has been highly improved and can be considered generally good in iOS 10.

#### Core Data stack.
I believe many developers experienced really bad pain in the beginning when setting up Core Data stack.
Core Data stack is about how to setting up [NSManagedObjectModel](https://developer.apple.com/reference/coredata/nsmanagedobjectmodel), [NSPersistentStoreCoordinator](https://developer.apple.com/reference/coredata/nspersistentstorecoordinator), [NSManagedObjectContext](https://developer.apple.com/reference/coredata/nsmanagedobjectcontext), since these components only does partial functionality, you have to set up Core Data stack according to your application's design. This means there's no such a best practice.

(Bit Nerd Ranch mentioned some common stacks: [Introducing the Open-Source Big Nerd Ranch Core Data Stack](https://www.bignerdranch.com/blog/introducing-the-big-nerd-ranch-core-data-stack/))

###### Flexibility is good, developer friendly is important.

We got [NSPersistentContainer](https://developer.apple.com/reference/coredata/nspersistentcontainer) in iOS 10.
The main purpose of `NSPersistentContainer` is to simplify the process of setting up Core Data stacks and provide some useful utils for our daily usage.

```swift
let container = NSPersistentContainer(name: "DataModel")
container.loadPersistentStores(completionHandler: { [weak self](storeDescription, error) in
    if let error = error {
        NSLog("CoreData error \(error), \(error._userInfo)")
        self?.errorHandler(error)
    }
  }
)
```

If you ever developed with Core Data stacks you probably know this is a huge improvement.

```swift
container.viewContext.perform {
  // foreground task
}

container.performBackgroundTask {
  // background task
} 
```

NSPersistentContainer handles task as well, a really good utils.

NSPersistentContainer is nothing but a wrapper, providing some default values and behaviours. So we don't have to worry about futher configuration.

#### Xcode 8 codegen
Xcode 8 introduced NSManagedObject's codegen, we used to created NSManagedObject subclass by ourselves which is representing `xcdatamodel`'s entity.

You don't have to do it anymore, when your `xcdatamodel` file is modified and saved, Xcode generates corresponding NSManagedObject subclass for you, automatically. 

btw, Xcode's codegen is not as powerful as [mogenerator](https://github.com/rentzsch/mogenerator), but good enough for beginner. (no commands no setups)


###### Finally, I can introduce Core Data as a persistence store option for my beginner friends.
