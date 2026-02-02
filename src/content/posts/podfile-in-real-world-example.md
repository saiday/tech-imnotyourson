---
title: "Podfile in real-world example"
slug: "podfile-in-real-world-example"
date: "2020-07-07T14:51:50.000Z"
description: "Detailed explanation If you're still targeting your pod specs trunk to , you better switch to for speed up process. ref: If you have build configurations other..."
tags: ["CocoaPods", "Podfile"]
draft: false
---

```ruby
source 'https://cdn.cocoapods.org/'

platform :ios, :deployment_target => '11.0'
inhibit_all_warnings!

project 'your_project_name', 'Variant Debug' => :debug, 'Variant Release' => :release

target 'your_target' do
    project 'your_project_name'
    pod 'HysteriaPlayer',                       '~> 2.2.2'
    pod 'SDWebImage',                           '~> 4.0.0'
    ...
        
    pod 'some_private_pod', :git => 'https://github.com/some/pod.git', :commit => '142789f795def15ba7282bf73e83cf777a29a8e0'

    target :your_test_target do
        inherit! :search_paths
        pod 'Aspects',                          '~> 1.4.1'
    end
end

post_install do |installer|
    installer.pods_project.root_object.attributes['LastSwiftMigration'] = 9999
    installer.pods_project.root_object.attributes['LastSwiftUpdateCheck'] = 9999
    installer.pods_project.root_object.attributes['LastUpgradeCheck'] = 9999
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings.delete 'IPHONEOS_DEPLOYMENT_TARGET'
            config.build_settings.delete('ARCHS')
        end
    end
end
```

#### Detailed explanation
######`source 'https://cdn.cocoapods.org/'`
If you're still targeting your pod specs trunk to `https://github.com/CocoaPods/Specs.git`, you better switch to `https://cdn.cocoapods.org/` for speed up `pod install` process.
 
ref: [offical changelog](http://blog.cocoapods.org/CocoaPods-1.8.0-beta/)

######`project 'your_project_name', 'Variant Debug' => :debug, 'Variant Release' => :release'`
If you have build configurations other than default `Debug` and `Release`, you need to specify which build type of it should be used so that CocoaPods could set build setting attributes correctly. For example, `Enable Testability` and `Build Active Architecture Only` attribute only set YES on Debug build type.


###### `post_install`
```ruby
    installer.pods_project.root_object.attributes['LastSwiftMigration'] = 9999
    installer.pods_project.root_object.attributes['LastSwiftUpdateCheck'] = 9999
    installer.pods_project.root_object.attributes['LastUpgradeCheck'] = 9999
```
If your pod contained static library compiled by older Swift version than your project. Xcode will likely give you a `Swift conversion` warning, but there's nothing you can do about it.
This strange setting aims to suppress the `Swift conversion` warning.

Ref: https://github.com/CocoaPods/CocoaPods/issues/8674#issuecomment-524097348

```ruby
installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings.delete 'IPHONEOS_DEPLOYMENT_TARGET'
            config.build_settings.delete 'ARCHS'
        end
    end
```

Preventing pod target overrides Pods project build setting. This could be fixed on the newer CocoaPods version, check before you add those configs.
