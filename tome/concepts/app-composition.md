---
id: concepts/app-composition
kind: concept
refs:
  - src/App.js#App
  - src/Player.js#Player
  - src/NextPlayer.js#NextPlayer
generated: 2114c1b
---
## What it is

`App` (src/App.js) is a single class component that owns application state and passes it down. Its visible children are `Player`, `NextPlayer`, and `SearchItem`. App holds `total_queue`, `queue_pos`, the Spotify `player` and `deviceID`, play flags, search results, and the additional-feature strings. The handlers `play` and `queue` are methods on App and are given to children as callbacks, so children do not mutate the queue themselves; they call up and App calls `setState`.

`Player` (src/Player.js) receives `total_queue`, `queue_pos`, `device`, `is_playing`, `progress_ms`, the theme flag, and callbacks (`playFunc`, `removeFunc`, `updateFunc`, `clearQueue`, `updateLastSecond`). It renders the current cover, title and artist, the control buttons, and a progress bar whose width is `progress_ms / songDuration`. It also renders two queue strips: played tracks (`slice(0, queue_pos)`) and upcoming tracks (`slice(queue_pos + 1)`). The control buttons make their own Spotify requests (play, pause, seek, save to library, playlist upload) and then call the App callbacks so state is refetched.

`NextPlayer` (src/NextPlayer.js) shows up to three recommendations from `props.next`, with feature text per row. Clicking a row calls `queueFunc(track, total_queue.length, isFirst)`. The refresh image calls `props.refreshFunc(true)`.

Search items are created inside App's `getSearchResults`, each given `setFunc`, `playFunc`, and `queueFunc`.

```
child click -> App handler -> Spotify request -> setState -> children re-render
```

The order of children inside App's render method is not recorded in the provided source.
