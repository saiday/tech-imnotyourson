---
title: "Vim insert current time"
slug: "vim-insert-current-time"
date: "2021-11-27T09:13:09.000Z"
description: "I'm using Jekyll, and Jekyll's post needed a date time for metadata like below, it would be better if we have a shorthand for date time insertion. in my .vimrc..."
tags: ["vim"]
draft: false
---

I'm using Jekyll, and Jekyll's post needed a date time for metadata like below, it would be better if we have a shorthand for date time insertion. 

```
---
layout: post
title:  "pandemic"
date:   2021-11-17 19:19:26 +0800
---
```

in my .vimrc
```vim
...

" insert current date time
" e.g. 2021-11-17 19:19:26 +0800
nnoremap <F5> "=strftime("%Y-%m-%d %H:%M:%S %z")<CR>P
inoremap <F5> <C-R>=strftime("%Y-%m-%d %H:%M:%S %z")<CR>

...
```

Since Vim already had a build-in function `strftime` so it can be done very easily. 
Now on Vim editor, I can insert date time by **F5**.
