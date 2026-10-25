---
id: concepts/playback-lifecycle
kind: concept
refs:
  - src/App.js#App
  - src/Player.js#Player
  - src/NextPlayer.js#NextPlayer
generated: 2114c1b
---
## What it is

`App` owns the playback state: `total_queue`, `queue_pos`, `is_playing`, `progress_ms`, and a `current` flag. `Player` receives those as props and renders the active track from `total_queue[queue_pos]`. Nothing in `Player` stores a track of its own.

**Starting a track.** `App.play(queuePosition)` sets `playLock`, then calls Spotify's `PUT /me/player/play` with the URI at that queue position and the current `deviceID`. On success it sets `queue_pos`, resets `progress_ms`, clears `playLock`, sets `current: true`, and calls `updateMediaSession(true)`. On failure it retries twice, then calls `recoverPlayback(queuePosition)`, which stores the position in `pendingPlayPosition` and tries `syncDevice` and `rebuildPlayer`. When the tab becomes visible again, the pending position is replayed.

**Rendering the current track.** `Player` shows the cover, name, and first artist at `queue_pos`. The progress bar width is `progress_ms` over the track's `songDuration`. Tracks before `queue_pos` render in `played_queue`, tracks after it in the queue card. When `current` is false, `Player` shows "Select A Song To Begin" instead.

**Play and pause.** `is_playing` comes from `App.updatePlaying`, which reads `/me/player` and copies `is_playing` and `progress_ms`. `Player` shows the pause image when `is_playing` is true and the play image when it is false. The buttons themselves call Spotify directly: play, pause, and seek go straight to the API. Next and previous call `props.playFunc(queue_pos ± 1)`, so the track change goes through `App.play`.

**Lock screen.** `updateMediaSession` sets metadata title, artist, and artwork from the current queue entry, sets `playbackState` from `is_playing`, sets position state, and re-registers action handlers. The `nexttrack` and `previoustrack` handlers call `play` with an adjacent queue position. `syncFromState` compares the SDK's current track URI to the queue and moves `queue_pos` if they differ.
