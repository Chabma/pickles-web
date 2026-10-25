---
id: concepts/search-to-play-flow
kind: concept
refs:
  - src/SearchItem.js#SearchItem
  - src/App.js#App
  - src/queue.js
generated: 2114c1b
---
## What it is

The search-to-play path runs through `App.js`, `SearchItem.js`, and the queue methods on the `App` component. `queue.js` is empty in the supplied source, so queue behavior lives in `App.js`.

`App.getSearchResults(query)` calls Spotify’s search endpoint with `type=track`. For each returned track it builds a `SearchItem`, passing the track, artist names, current queue position, current queue, player, theme flag, and callbacks for clearing search and adding to the queue. The results are stored in `state.searchResults`.

`SearchItem` renders the album image, track name, and artists. Its behavior depends on whether the queue is empty:

- **Empty queue:** clicking the row clears the search, calls `player.activateElement()`, then calls `queueFunc(element, queue_pos, true)`. This inserts the track at the current position and requests playback.
- **Non-empty queue:** row clicks do nothing. Two action images appear: one adds the track after the current item (`queue_pos + 1`), the other adds it at the end (`total_queue.length`). Both clear the search first.

`App.queue(track, position, playBoolean, tickBool)` creates a queue item from the Spotify track, inserts it using slices before and after `position`, and updates `total_queue`. If `playBoolean` is true, it calls `play(position, tickBool)`; it then calls `getRecs()`.

`App.play` sends the track URI to Spotify’s `/me/player/play` endpoint for the current device. On success it sets `queue_pos`, resets progress, marks the track current, and updates the media session. Failures retry up to two times, then enter `recoverPlayback`. If the requested position is past the queue, `play` queues `state.next[0]` at the end with playback enabled.
