---
id: src/Player.js
kind: file
refs:
  - src/Player.js
  - src/Player.js#FlipCover
  - src/Player.js#QueueItem
  - src/Player.js#Player
generated: 2114c1b
---
## What it is

`src/Player.js` exports `Player`, the now-playing screen of the app, along with two local components, `FlipCover` and `QueueItem`. It also imports image assets for light and dark button icons.

## FlipCover

A wrapper that flips to a "remove?" panel. Taps are timestamped; two taps within 450 ms toggle the flip. `stopPropagation` on the tap keeps the event away from a window-level particle click handler. When flipped, an effect attaches a document click listener so a click outside the cover dismisses it, deferred with `setTimeout(0)` so the flip gesture does not instantly close itself.

## QueueItem

One row in a queue list: a `FlipCover` holding the track's square avatar, the track name, and the comma-joined artist names. Confirming the flip calls `onRemove(index)`.

## Player

A function component taking playlist state and Spotify auth through props, defining handlers that call the Spotify Web API with `fetch`:

- `play_btn_func` — PUTs play, swaps the play/pause divs, calls `updateLastSecond`, and calls `updateFunc(false)` unless the pickles player is active.
- `seek_func` — converts a click offset against the `.now-playing__side` width into milliseconds and PUTs a seek.
- `pause_btn_func` — PUTs pause, then either calls `updateFunc(false)` or `clearQueue`.
- `next_btn_func` / `previous_btn_func` — reset the library icon image and call `playFunc` at `queue_pos ± 1`. The `device` argument is unused.
- `add_to_library_btn_func` — sets the checked icon and PUTs the track id to `/me/tracks`.
- `add_song_to_playlist` — POSTs one track URI; on a failed response it calls itself again with the same arguments.
- `add_playlist_btn_func` — creates a private playlist, then loops over the whole queue adding each track, then alerts.

`progressBarStyles` sets the bar width from `progress_ms` divided by the current track's `songDuration`.

## Rendering

Two cards hold the played tracks (`slice(0, queue_pos)`) and the upcoming ones (`slice(queue_pos + 1)`); each becomes a hidden card when empty. A loop checks `additionalFeatures` for `"acousticness"` and assigns `featureSummary`, but that variable is not used in the output; the render prints `props.additionalFeatureString` instead.

When `props.current` is set, the layout shows the cover, track name and artist as SVG text, five control icons, and the clickable progress bar. Otherwise it shows "Select A Song To Begin".
