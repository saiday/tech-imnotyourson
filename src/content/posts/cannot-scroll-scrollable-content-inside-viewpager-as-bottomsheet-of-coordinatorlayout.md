---
title: "Cannot scroll scrollable content inside ViewPager as BottomSheet of CoordinatorLayout?"
slug: "cannot-scroll-scrollable-content-inside-viewpager-as-bottomsheet-of-coordinatorlayout"
date: "2018-03-24T20:19:46.000Z"
description: "If you had multiple scrollable contents inside ViewPager as BottomSheet of CoordinatorLayout. You might notice that your scrollable contents unable to scroll..."
tags: ["android", "ViewPager", "BottomSheet"]
draft: false
---

If you had multiple scrollable contents inside ViewPager as BottomSheet of CoordinatorLayout.
You might notice that your scrollable contents unable to scroll except the first one.

After doing some research I found that this is a default behaviour of BottomSheetBehavior by design. Though I disagree with this behavior on the point. 

From BottomSheetBehavior source code of design library, I found the condition of picking `NestedScrollView` inside BottomSheet incredibly simple. It just pick the first `NestedScrollView` which is enabled, no matter how many views inside the viewgroup.

Code for glance ([source code link](https://github.com/aosp-mirror/platform_frameworks_support/blob/57f7e35572a20b6ff4bd99fb714e2efcbf8023bb/design/src/android/support/design/widget/BottomSheetBehavior.java#L607-L611)):
```java
View findScrollingChild(View view) {
    if (ViewCompat.isNestedScrollingEnabled(view)) {
        return view;
    }
    if (view instanceof ViewGroup) {
        ViewGroup group = (ViewGroup) view;
        for (int i = 0, count = group.getChildCount(); i < count; i++) {
            View scrollingChild = findScrollingChild(group.getChildAt(i));
            if (scrollingChild != null) {
                return scrollingChild;
            }
        }
    }
    return null;
}
```


##### My Solution

<script src="https://gist.github.com/saiday/2ae656aef8a2779f593867464ffa0a87.js"></script>

The tag of `NestedScrollView` is the position of view pager that you have to set on ViewPager's view instantiating.

Since BottomSheet only pick the first encountered `NestedScrollView` which is enabled in ViewGroup,  the trick is only enable the current scroll view and disable all others.
