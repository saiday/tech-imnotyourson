---
title: "Enhance poor performance of decoding audio with MediaExtractor and MediaCodec to PCM"
slug: "enhance-poor-performance-of-decoding-audio-with-mediaextractor-and-mediacodec-to-pcm"
date: "2022-10-29T13:38:33.000Z"
description: "Current situation It takes 30 seconds for decoding a (file size: 4 MB, bit rate: 128 kbps, length: 4 minutes) file to PCM using and , this is unbearable for..."
tags: ["android", "MediaCodec", "MediaExtractor", "Audio"]
draft: false
---

#### Current situation
It takes 30 seconds for decoding a `mp3` (file size: 4 MB, bit rate: 128 kbps, length: 4 minutes) file to PCM using `MediaExtractor` and `MediaCodec`, this is unbearable for user experience.

#### Problem
1. `MediaExtractor` can only read samples by `advance()` and reads [418 bytes](http://www.mp3-tech.org/programmer/frame_header.html) in a single step.
2. `MediaCodec`'s input buffer and output buffer lock the current thread on executing.

Real-world example:
4 MB file leads to 1,048,576 x 2 (input/output buffer) execution by `MediaCodec` which means 2,097,152 times thread locks. Of course we cannot have a good performance.

### Solution
The goal is to reduce `MediaCodec` execution counts by collecting enough samples by `MediaExtractor` in memory then feeding it to `MediaCodec`. We can expect performance enhancement.

##### 96% faster
If I collect 524,288 bytes (0.5 MB) for `MediaCodec`'s input buffer instead of just-in-time's 418 bytes, now it's 96% faster.  
HUGE.


#### Sample code:
Brief description:
1. `inputFormat.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, DECODE_INPUT_SIZE);` for setting input buffer's size
2. collect samples from `MediaExtractor` and feed samples to `MediaCodec` on `MediaCodec`'s `onInputBufferAvailable()` callback
3. decode to PCM on `MediaCodec`'s `onOutputBufferAvailable()` callback
4. store decoded samples on `mDecodedSamples`

<script src="https://gist.github.com/saiday/39700858a5c30ac26ac6656a96349c3a.js"></script>
