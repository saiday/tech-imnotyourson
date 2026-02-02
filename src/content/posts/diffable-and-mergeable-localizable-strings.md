---
title: "Diffable and mergeable Localizable.strings"
slug: "diffable-and-mergeable-localizable-strings"
date: "2016-02-06T18:55:20.000Z"
description: "TL;DR 1. Convert Localizable.strings to 2. Set Convert Copied Files to 3. Set Strings file Output Encoding to UTF-16 \".strings\" Files Note: It is recommended..."
tags: ["Encoding", "Git", "Localizable.strings"]
draft: false
---

TL;DR

1. Convert Localizable.strings to `UTF-8`
2. Set **Convert Copied Files** to `YES`
3. Set **Strings file Output Encoding** to `UTF-16`

#### UTF-16 ".strings" Files 

> Note: It is recommended that you save strings files using the UTF-16 encoding, which is the default encoding for standard strings files. It is possible to create strings files using other property-list formats, including binary property-list formats and XML formats that use the UTF-8 encoding, but doing so is not recommended.     [Apple String resource documentation](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html)

Apple recommended Localizable.strings encoded using UTF-16, but major Version control systems (VCS) such as Git or Mercurial doesn't like UTF-16 very much. They treat files encoded using UTF-16 as binary. So that we can't diff and merge Localizable.strings (UTF-16) like what we did to our source codes (UTF-8).

There's a solution I found by [karl's post](http://blog.xk72.com/post/31456986659/diff-strings-files-in-git), use `gitattributes` to indicate `*.strings` file should convert from UTF-16 to UTF-8 on diff command. This is good and clean but not becoming my solution.

Because it's a little bit complicated, I have to set `.gitattributes` file for all iOS projects, and all contributors have to set same diff's [driver_name](https://git.wiki.kernel.org/index.php/Textconv#Textconv_driver_configuration) at their own`~/.gitconfig`.
The two most important things are: 
1. My favorite git command `git add -p` will not work on binary file for sure.
2. [GitHub](https://github.com/) doesn't handle UTF-16 either.

These two considerations are crucial for me, I need a better solution.

#### Use UTF-8 text encoding, convert it to UTF-16 on building process

First, convert our Localizable.strings to UTF-8 encoding, Xcode's **File inspector** is convenient to do it.
![](/content/images/2016/02/Screenshot-2016-02-07-01-36-58.png)

There is a magical flag that Xcode provided: **Convert Copied Files**
![](/content/images/2016/02/Screenshot-2016-02-07-02-43-54.png)
The description says:
> Files copied with a 'Copy Files Build Phase' are unchanged by default.  Setting this to TRUE causes Property Lists (.plist) and Strings files to be converted as specified by 'Property List Output Encoding' and 'Strings file Output Encoding'.. [APPLY_RULES_IN_COPY_FILES]

This description says it all, we have to find another flag **Strings file Output Encoding**.
> Specify the encoding to be used for Strings files (by default, the output encoding will be 16-bit Unicode).  The value can be either an NSStringEncoding, i.e. one of the numeric values recognized by NSString, or it can be an IANA character set name as understood by CFString.  The operation will fail if the file cannot be converted to the specified encoding. [STRINGS_FILE_OUTPUT_ENCODING]

Set **Strings file Output Encoding** to `UTF-16`, that's it.

![](/content/images/2016/02/Screenshot-2016-02-07-01-37-29.png)
