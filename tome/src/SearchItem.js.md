---
id: src/SearchItem.js
kind: file
refs:
  - src/SearchItem.js
  - src/SearchItem.js#SearchItem
generated: 2114c1b
---
## What it is

`src/SearchItem.js` exports a React function component named `SearchItem`. It renders one search result as an Ant Design `List.Item` and provides controls for playing or queueing that result. All data and actions come from props.

### Track display

The component shows:

- A square avatar using `props.element.album?.images?.[0]?.url`.
- The track name from `props.element.name`.
- The artists from `props.artists`, joined with `", "`. If `props.artists` is missing, an empty array is used.
- Text set to a single line with ellipsis overflow.
- The list item keyed by `props.element.uri` and set to full width.

### Row click

Clicking the row does something only when `props.total_queue?.length == 0`. In that case it:

1. Calls `props.setFunc("", [])`.
2. Calls `props.player.activateElement()`.
3. After that promise resolves, calls `props.queueFunc(props.element, props.queue_pos, true)`.

The purpose of the empty-string and empty-array arguments, the queue-length condition, and the third `true` argument is not recorded.

### Queue buttons

Two images appear in the item’s `extra` area only when the queue is not empty:

- **Add to start** calls `props.setFunc("", [])`, then `props.queueFunc(props.element, props.queue_pos + 1)`.
- **Add to end** calls `props.setFunc("", [])`, then `props.queueFunc(props.element, props.total_queue.length)`.

The start button uses `queue_pos + 1`; why it adds one is not recorded. Both buttons choose dark or light images through `props.isDark`.

### Commented code

Large commented blocks contain alternate play-button behavior. They do not run. The imported `play_btn` image is referenced only inside those comments. Why the code was left in place is not recorded.
