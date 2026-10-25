---
id: src/NextPlayer.css
kind: file
refs:
  - src/NextPlayer.css
  - src/NextPlayer.css#.now-playing__name
  - src/NextPlayer.css#.now-playing__artist
  - src/NextPlayer.css#.now-playing__status
  - src/NextPlayer.css#.now-playing__img
  - src/NextPlayer.css#.now-playing__img
  - src/NextPlayer.css#.now-playing__side
  - src/NextPlayer.css#.progress
  - src/NextPlayer.css#.progress__bar
  - src/NextPlayer.css#.next-wrapper
  - src/NextPlayer.css#.next-playing__img
  - src/NextPlayer.css#.next-playing__side
  - src/NextPlayer.css#.next-playing__name
  - src/NextPlayer.css#.next-playing__artist
  - src/NextPlayer.css##nextPlayer
generated: 2114c1b
---
## What it is

A stylesheet for a "now playing" panel and the next-track queue. It also covers a small progress bar, a row of buttons, and the `#nextPlayer` column that holds the queue. Nearly all text is purple, and layout is done with a mix of floats, flexbox, and percentage widths.

## Current track

- `.now-playing__name` is the track title: 1.5em, purple, small bottom margin.
- `.now-playing__artist` and `.now-playing__status` are `1em` purple blocks with a `1em` bottom margin.
- `.now-playing__img` is a left-floated column at 50% width, centered with `display: flex` and `flex-direction: column`. Its inner `img` is capped at 400px, fills the available width, and centers itself.
- `.now-playing__side` is the companion left-floated column, also 50% wide with 10px padding. The two 50% halves sit side by side to form the panel; a clearfix is not present, so the parent depends on its own layout rules.

## Progress bar

`.progress` is a 6px tall, 3px-radius box with a black border and `overflow: hidden` so the filled portion is clipped to the rounded shape. `.progress__bar` fills it in purple. No width is set here, so the width must come from the markup or inline style, typically from playback position.

## Next track and queue

- `.next-wrapper` spans 100% width.
- `.next-playing__img img` is capped at 150px and set to 80% width.
- `.next-playing__side` is left-floated, full width, with 10px padding.
- `.next-playing__name` (0.5em) and `.next-playing__artist` (0.7em) are purple, with small bottom margins to keep the queue rows compact.
- `#nextPlayer` is a left-floated 25% column and a flex container with column direction.
- `#queue` caps its height at 80%.

## Buttons

`#buttons` is a full-width flex row with `margin-left/right: auto`, centering it. `#buttons_two` is a 100px tall flex column. `.button_img` takes 33% width and centers, giving three buttons across.

The reason for the two separate button containers is not recorded.
