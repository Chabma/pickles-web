---
id: src/App.css
kind: file
refs:
  - src/App.css
  - src/App.css#.App
  - src/App.css##root
  - src/App.css#.App-logo
  - src/App.css#.App-logo
  - src/App.css#.App-main
  - src/App.css#.App-main
  - src/App.css#.App-link
  - src/App.css#.main-wrapper
  - src/App.css#.App-header
  - src/App.css##logo
  - src/App.css##logo_text
  - src/App.css##account_image
  - src/App.css#.additionalFeaturePill
  - src/App.css##refresh_btn
generated: 2114c1b
---
## What it is

`src/App.css` is the single stylesheet for the application. It holds global page layout, the loaded Nabla display font, and styles for each screen area: header, search, recommendation list, now-playing panel, progress bar, queue, and settings.

## Layout and globals

`.App` and `#root` are set to full height; `.App` centres text, hides overflow, and sits at `z-index: 1`. `.App-main` is declared twice with conflicting rules (first a row flexbox, then a column flexbox with a bottom border and 30px margin). The second block wins for the properties both share. `.main-wrapper` is a full-width scroll container. `#particles-js` is a fixed full-height white background at `z-index: -2`, behind everything.

The `@font-face` rule loads `Nabla-Regular-VariableFont_EDPT,EHLT.ttf` with `font-display: block`. Seven `@font-palette-values` blocks (`--0` through `--6`) define alternate colour palettes for that font; `#logo_text` uses palette `--5` with variation settings and a fixed 45px size.

## Header and search

`.App-header` takes 8% height. `#logo` floats left, `#logo_text` sits beside it, and `#account_image` floats right as a circular avatar (`border-radius: 1000px`).

`.Search` is an 88%-width inline block. When focused, `.Search--focused` fixes it near the top with `z-index: 2001`, and `.search-backdrop` paints a dark overlay at `z-index: 2000` beneath it.

## Players

The recommendation area uses `.next-wrapper` (horizontal scroll, light background) and `#nextPlayer` (a 33%-height flex row). Each item shows a cover (`.next-playing__img`) and text side (`.next-playing__side`).

The current track has `.now-playing__name`, `.now-playing__artist`, `.now-playing__img`, and `.now-playing__side`. These selectors appear more than once; later definitions override earlier colours and sizes. The second `.now-playing__name` uses purple, `calc(18px + 2.5vw)`, and centred text.

`.progress` is a bordered 10px bar and `.progress__bar` fills it in `#1e1b96`.

## Queue and interactions

`.flip-cover` and its children implement a two-sided card: the inner element rotates 180° when `.flipped` is added, revealing `.flip-cover-back` with a red remove label. A comment says this appears on double-tapping an album cover. `.queue-item-meta` centres those covers only in the queue.

`.settings_header` and `.settings` style an accordion panel; `.active` is listed alone beside a commented-out hover rule, so its effect is not recorded.

Other rules cover the custom scrollbar, `#buttons`, card and list-item sizing, placeholder colour, and the `Login-hover` keyframes that move `.App-logo` around the screen unless the user prefers reduced motion.
