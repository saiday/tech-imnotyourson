---
title: "Table View Cell Dynamic Height With AutoLayout for iOS 7 later"
slug: "table-view-cell-dynamic-height-with-autolayout-for-ios-7-later"
date: "2015-02-16T15:05:59.000Z"
description: "Update new post talks about UITableView dynamic height with AutoLayout We all know iOS 8 introduced auto-sizing tableview cell , but that are compatible with..."
tags: ["iOS", "AutoLayout", "Height", "UITableViewCell"]
draft: false
---

#### Update new post talks about UITableView dynamic height with AutoLayout ####
[UITableViewCell dynamic height with AutoLayout conclusion](http://imnotyourson.com/uitableviewcell-dynamic-height-with-autolayout-conclusion/)

We all know iOS 8 introduced auto-sizing tableview cell [What's New in Table and Collection Views Session 226](https://developer.apple.com/videos/wwdc/2014/), but that are compatible with iOS 8 later. So, maybe later.

I setup my auto layout cell programmatically using [PureLayout](https://github.com/smileyborg/PureLayout).

```
- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
	self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
	if (self) {
	[self setupCustomConstraints];
}

	return self;
}
```

```
- (void)layoutSubviews
{
	[super layoutSubviews];

	[self.contentView setNeedsLayout];
	[self.contentView layoutIfNeeded];

	self.textLabel.preferredMaxLayoutWidth = CGRectGetWidth(self.textLabel.frame);
}
```

Table View needs some settings as well
```
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
	static CustomizedCell *sizingCell = nil;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
	sizingCell = [self.tableView dequeueReusableCellWithIdentifier:kCellIdentifier];
});
	sizingCell.textLabel.text = @“Random length strings”;
	[sizingCell setNeedsLayout];
	[sizingCell layoutIfNeeded];
	CGFloat height = [sizingCell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize].height;
	return height;
}

```

What `dispatch_once` done is to prevent memory leaks as the cell is created but not returning from `cellForRowAtIndexPath`.

You may occur auto-layout conflicts with `UIView-Encapsulated-Layout-Height`, then you should lower your own constrains priority to make `UIView-Encapsulated-Layout-Height` pass first, never mind, your height will be set properly when your cell been calculate by yourself and auto layout will fits that height.

#### Update new post talks about UITableView dynamic height with AutoLayout ####
[UITableViewCell dynamic height with AutoLayout conclusion](http://imnotyourson.com/uitableviewcell-dynamic-height-with-autolayout-conclusion/)
