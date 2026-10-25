---
id: concepts/queue-model
kind: concept
refs:
  - src/queue.js
  - src/App.js#App
  - src/NextPlayer.js#NextPlayer
generated: 2114c1b
---
## What it is

The queue is a single array in `App` state, `total_queue`, plus an integer `queue_pos` that points at the track currently loaded in the player. Every track the app knows about — search results the user queues, recommendations, or tracks started directly — ends up in this array as an item object. Each item holds `uri`, `id`, `songDuration`, `name`, `artists`, `image`, and a prebuilt Ant Design `List.Item` for rendering.

## How tracks get in

`queue(track, position, playBoolean, tickBool)` builds that item and inserts it at `position`. It does this by slicing `total_queue` around the index, pushing the new item between the halves, and calling `setState`. So the array order is the play order, and inserting in the middle shifts everything after it.

After the state update, `queue` always calls `getRecs()` to refresh recommendations, and if `playBoolean` is true it calls `play(position, tickBool)`.

## How tracks get played

`play(queuePosition)` treats `queue_pos` as an index into `total_queue`. It sends that track's `uri` to the Spotify play endpoint, then sets `queue_pos` to the requested index. A `playLock` flag stops overlapping play requests. If the requested position is past the end of the array, `play` takes `this.state.next[0]` (the top recommendation), appends it with `queue`, and plays it.

`NextPlayer` renders the first three entries of `next`. Clicking one calls `queueFunc(track, total_queue.length, isFirst)`, which appends it to the end of the queue.

## Keeping position honest

`syncFromState` compares the SDK's current track URI with `total_queue[queue_pos].uri`. If they differ, it searches the array from the end backwards for the matching URI and moves `queue_pos` to that index. Searching backwards means duplicate tracks resolve to the most recent copy.
