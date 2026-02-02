---
title: "Spotify Library not synced on Windows"
slug: "spotify-library-not-sync-on-windows"
date: "2019-03-16T09:48:09.000Z"
description: "I'm a Spotify user having multiple devices on many platforms. I found out that Windows Spotify's library data inconsistency compared to my other devices. The..."
tags: ["Spotify"]
draft: false
---

I'm a Spotify user having multiple devices on many platforms.

I found out that Windows Spotify's library data inconsistency compared to my other devices.
The newest song isn't updated. Moreover, the song sets are different from other devices; some songs just missed.

Re-Login or Reinstall cannot solve the dataset inconsistency.

You have to delete this directory on Windows to make Spotify sync Library all over again (Windows 10): 
```
%appdata%\Local\Packages\SpotifyAB.SpotifyMusic_xxxxxxxx\LocalState\Spotify/Users
```


ref:
[Playlists not syncing between devices (Spotify Community)](https://community.spotify.com/t5/Desktop-Windows/Playlists-not-syncing-between-devices/td-p/380278)
