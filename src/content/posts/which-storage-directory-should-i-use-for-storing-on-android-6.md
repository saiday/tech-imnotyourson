---
title: "Which storage directory should I use for storing on Android 6+"
slug: "which-storage-directory-should-i-use-for-storing-on-android-6"
date: "2018-09-15T11:59:44.000Z"
description: "Android File System Structure Android uses the Linux file system structure which has a single root. So, both internal storage and external storage are..."
tags: ["android"]
draft: false
---

# Android File System Structure
Android uses the Linux file system structure which has a **single root**.  
So, both internal storage and external storage are directories which are **partition** in Android file system. 


## Partitions
There's some storage related partitions: `/data`, `/storage` and `/sdcard` that worth mentioning.

###### /data
You can consider `/data` to be internal storage partition.
When you perform a data or factory reset, it is the partition that you are wiping.

`/data` contains two directories: `app/`, `data/`

- `app/`
  - store all package's `.apk` file
- `data/`
  - each package's **Internal Storage**

###### /storage
In contrast to `/data`, `/storage` can be considered external storage partition in general.

`/storage` contains two directories: `emulated/`, `self/`

- `emulated/`
  - user's external storage
- `self/`
  - current user(*) identifier

*user of multi-user on Android 4.2+


###### /sdcard
Actually `/sdcard/` and `mnt/sdcard` is a symlink to `/storage/self/primary` on Android 6.0+.

Tracing these symlinks:
```shell
/sdcard ---> /storage/self/primary
/mnt/sdcard ---> /storage/self/primary

/storage/self/primary ---> /mnt/user/0/primary

/mnt/user/0/primary ---> /storage/emulated/0
```

`/sdcard` eventually links to `/storage/emulated/0`.

> All Android devices have two file storage areas: "internal" and "external" storage. Many devices now divide the permanent storage space into separate "internal" and "external" partitions.  [Choose internal or external storage](https://developer.android.com/training/data-storage/files#InternalVsExternalStorage)

It's noteworthy that `/sdcard` isn't your physical SD card. 
`/sdcard` is **Primary External Storage** which divided from permanent storage.

If you had a physical SD card inserted then you had **Secondary External Storage**, you can find it under `/storage`.

## Internal and external storage 
Users cannot access internal storage, only the apps can but limited to their own package's directory. 
You must have an external storage even if you have no SD card inserted. (Some modern devices have no SD card slot actually)

###### Internal storage
`/data/data/your.package/`

The files in internal storage would be removed on app uninstall.
The files are private, only your app can access it.

###### Public external storage
`/storage/emulated/0`

The files in public external storage would **not** be removed on app uninstall.
The files are shared, means other apps can access.

###### Private external storage
`/storage/emulated/0/Android/data/your.package/`  

The files in private external storage would be removed on app uninstall.
The files are private, only your app can access it.

##### Storage related APIs
Internal storage:

- `Context.getCacheDir()` - `/data/data/your.package/cache/`
- `Context.getFilesDir()` - `/data/data/your.package/files/`

Public external storage:

- `Environment.getExternalStorageDirectory() ` - `/storage/emulated/0/`
- `Environment.getExternalStoragePublicDirectory(DIRECTORY_DCIM ...)` - `/storage/emulated/0/DCIM ...`

Private external storage:

- `context.getExternalCacheDir()` - `/storage/emulated/0/Android/data/your.package/cache/`
- `context.getExternalFilesDir()` - `/storage/emulated/0/Android/data/your.package/files/`

Notice that `Context` is app related storage, `Environment` is public storage.
