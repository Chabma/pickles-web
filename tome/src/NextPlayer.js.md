---
id: src/NextPlayer.js
kind: file
refs:
  - src/NextPlayer.js
  - src/NextPlayer.js#NextPlayer
generated: 2114c1b
---
## What it is

A React function component that renders the "next player" panel: a short list of recommended tracks and a refresh button. It takes all its data and behaviour from `props` and holds one derived value.

## Props it reads

- `next` — array of recommended tracks. Its presence also acts as the loading flag.
- `next_features` — parallel array of text strings shown under each track.
- `queueFunc` — function called when a recommendation is clicked.
- `total_queue` and `isFirst` — passed through to `queueFunc` unchanged.
- `refreshFunc` — function called with `true` when the refresh image is clicked.
- `isDark` — chooses which refresh image to show.

## What it renders

`recommendations` is `props.next.slice(0, 3)`, so at most three tracks are shown. When `next` is absent, the component shows only the text "loading recommendations...". When `next` exists, it shows the track list (if any) plus the refresh button.

Each track row has:

- an image from `track.album?.images?.[0]?.url`; the optional chaining means a missing album or image renders an empty `src`
- the track name
- the first artist's name, `track.artists[0].name` — this has no optional chaining, so a track without an `artists` array would throw
- the matching entry from `next_features` by index, or an empty string if that prop is missing

Rows are keyed by `track.id` with the array index as a fallback. Clicking a row calls `queueFunc(track, props.total_queue.length, props.isFirst)`.

The refresh area is a `div` with an `onClick` that calls `refreshFunc(true)`. The image source switches between `refresh_btn_dark` and `refresh_btn` based on `isDark`.

## Styling

Layout comes from CSS classes (`next-wrapper`, `next-playing__img`, `next-playing__side`, `next-playing__name`, `next-playing__artist`) in `App.css`, plus a few inline styles: the list container uses 84% width and full height, and the features line uses a viewport-relative font size with horizontal scrolling and no wrapping.
