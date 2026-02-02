---
title: "UITableViewCell dynamic height with AutoLayout conclusion"
slug: "uitableviewcell-dynamic-height-with-autolayout-conclusion"
date: "2015-03-27T05:51:10.000Z"
description: "Before I've post last month, however been using this technique for a month since then, I found this the technique mentioned brings me laggy performance,..."
tags: ["iOS", "AutoLayout", "Height", "UITableViewCell"]
draft: false
---

### Before ###
I've post [Table View Cell Dynamic Height With AutoLayout for iOS 7 later](http://imnotyourson.com/table-view-cell-dynamic-height-with-autolayout-for-ios-7-later/) last month, however been using this technique for a month since then, I found this the technique [Table View Cell Dynamic Height With AutoLayout for iOS 7 later](http://imnotyourson.com/table-view-cell-dynamic-height-with-autolayout-for-ios-7-later/) mentioned brings me laggy performance, because of cell trying to relayout twice when calculating `heightForRowAtIndexPath:` and preparing `cellForRowAtIndexPath:`. As you seen below.

```
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static CommentedItemCell *sizingCell = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sizingCell = [self.tableView dequeueReusableCellWithIdentifier:kCellIdentifier];
    });
    AnyItem *item;
    [sizingCell configureCell:item];
    [sizingCell setNeedsLayout];
    [sizingCell layoutIfNeeded];
    CGFloat height = [sizingCell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize].height;
    return height;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    CommentedItemCell *cell = [tableView dequeueReusableCellWithIdentifier:kCellIdentifier forIndexPath:indexPath];
    AnyItem *item;
    [cell configureCell:item];
    return cell;
}
```

Performance problem is impact but not most frustrated, the technique depends on `systemLayoutSizeFittingSize` will calculate UITableViewCell size on Cell's `layoutsubviews:` method, I found out I always get `{320, 44}` at the first time, no matter which device I use, let alone the `UIView-Encapsulated-Layout-Height` issue. I know there's some ways to prevent it, but I'm so unsure about it, I don't feel happy when I solve the issue.

So, I keep looking for better solution to replace `systemLayoutSizeFittingSize` one.

### Now ###

Finally, that the subviews of cell calculate itself by `intrinsicContentSize` method, the old school technique works well for me, and I guess most of iOS programmer expericenced `intrinsicContentSize` method.

Create an UILabel subclass first.
<script src="https://gist.github.com/saiday/8e0e7f2ee9a2ab4ca8a0.js"></script>

Set constraints on your UITableViewCell well, you don't need to set Content Hugging and Content Compression Resistance anymore, because the UILabel calcutate it's height by self already. And you don't have to lower your constrints priority for `UIView-Encapsulated-Layout-Height` issue. Just set plain constraints for your cell.

And your UITableViewCell.m
```
- (void)layoutSubviews
{
    [super layoutSubviews];
    
    [self.label setNeedsLayout];
    [self.label layoutIfNeeded];
}
```

The controller which handles `UITableViewDelegate` do not implement `heightForRowAtIndexPath` method. Let the cell calculate the height and it will be set.

Most important thing is set estimatedRowHeight either by `self.tableView.estimatedRowHeight` or delegation `estimatedHeightForRowAtIndexPath` ways. This aid `UITableView` to knows how many cells it could appear at once time and relative to scrolling position.

That's it.


Please leave your comment about these two UITableViewCell dynamic height with AutoLayout techniques.
