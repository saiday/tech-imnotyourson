---
title: "Convert HLS video (mp4) into Gif with CLI shorthand"
slug: "convert-hls-video-mp4-into-gif"
date: "2019-07-29T07:23:07.000Z"
description: "Whatever Gif is the old or new sexy. You needed it anyhow. Dependencies and Prerequisites: - ffmpeg - imagemagick Use Homebrew or any other package manager to..."
tags: ["gif", "CLI"]
draft: false
---

Whatever Gif is the old or new sexy. You needed it anyhow.

###### Dependencies and Prerequisites:
- ffmpeg
- imagemagick

Use Homebrew or any other package manager to install them.
```bash
$ brew update
$ brew install ffmpeg
$ brew install imagemagick
```

###### How to use
For example, you'd like to convert `https://video.twimg.com/hls/_video.m3u8` to gif.
```bash
$ mkdir mp4_to_gif
$ ffmpeg -i myfile.mp4 -vf scale=420:-1:flags=lanczos,fps=10 mp4_to_gif/ffout%03d.png
$ convert -loop 0 mp4_to_gif/ffout*.png output.gif
$ rm -rf mp4_to_gif
```

###### What you really need

Edit your shell run commands (`bashrc`, `zshrc`), add this alias:
```bash
alias v2g='function _v2g(){ mkdir mp4_to_gif && ffmpeg -i $1 -vf scale=420:-1:flags=lanczos,fps=10 mp4_to_gif/ffout%03d.png && echo "converting gif ..." && convert -loop 0 mp4_to_gif/ffout*.png output.gif && rm -rf mp4_to_gif };_v2g'
```


You can now perform the operation as following:
```bash
$ v2g https://video.twimg.com/hls/_video.m3u8
```
