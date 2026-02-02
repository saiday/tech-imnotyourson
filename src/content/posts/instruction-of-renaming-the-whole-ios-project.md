---
title: "Instruction of renaming the whole iOS project  (CocoaPods integrated)"
slug: "instruction-of-renaming-the-whole-ios-project"
date: "2017-12-17T18:21:33.000Z"
description: "Open Xcode - Select your project inside Project navigator, there's a Name field inside File inspector under Identify and Type section. - Rename Scheme on..."
tags: ["Xcode", "Instruction"]
draft: false
---

#### Open Xcode
- Select your project inside **Project navigator**, there's a **Name** field inside **File inspector** under **Identify and Type section**.
![](/content/images/2017/12/rename-project.png)

- Rename Scheme on **Manage Schemes** by clicking scheme name
![](/content/images/2017/12/manage-scheme-1.png)

#### Quite Xcode

- Rename your `OLD.xcworkspace` to `NEW.xcworkspace`
- Rename your assets folder such as `OLD` and `OLDTests` to `NEW` and `NEWTests`

#### Reopen Xcode

- Project navigator will indicating your folder is missing, select missing folders, correct it with new folder name on **File inspector**'s name field just like the very first step.
![](/content/images/2017/12/rename-folder.png)

- Rename targets name by clicking target name inside **Targets** list
![](/content/images/2017/12/rename-target.png)

- Search and rename all hard-coded legacy name of target's build settings such as **Info.plist** and **Product bundle identifier**

#### Quit Xcode

- execute `pod deintegrate`, CocoaPods will deleting pod related configs, scripts, generated frameworks and also `Pods/` directory


#### Reopen Xcode
- Clean and build


---
References:
Most of the steps were highly inspired from StackOverflow Answers:
[How do I completely rename an Xcode project (i.e. inclusive of folders)?](https://stackoverflow.com/questions/33370175/how-do-i-completely-rename-an-xcode-project-i-e-inclusive-of-folders)
