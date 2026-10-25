---
id: concepts/style-layering
kind: concept
refs:
  - src/index.css
  - src/App.css
  - src/AppDark.css
  - src/Player.css
  - src/NextPlayer.css
generated: 2114c1b
---
## What it is

The styling is split across three populated sheets and one empty file.

- `src/index.css` — global base. Sets body margin to 0, hides body overflow, gives the page the Roboto system font stack with antialiasing, and gives `code` a monospace stack.
- `src/App.css` — the app-wide sheet. It holds shell layout (`#root`, `.App`, `.App-main`, `.App-header`, `.main-wrapper`), the Nabla logo font with its numbered `@font-palette-values`, the login animation keyframes, now-playing and recommendation blocks, progress bars, scrollbars, placeholder colors, the flip-cover remove control, and the focused-search overlay and backdrop. Every selector is unprefixed, so it all applies page-wide.
- `src/AppDark.css` — repeats most of `App.css` with each selector prefixed by `.Dark`. None of it applies until an ancestor element carries the `Dark` class; the code that toggles that class is not recorded. Rules the dark sheet leaves out keep the light values.
- `src/Player.css` — empty.
- `src/NextPlayer.css` — component rules for the now-playing and next-player blocks: names, artists, images, progress bar, queue height, buttons.

```
index.css   →  base
App.css     →  global selectors
NextPlayer  →  same selectors, different values
AppDark.css →  .Dark-prefixed overrides
```

Because `NextPlayer.css` and `App.css` both define `.progress` and `.now-playing__*` with different sizes, the winner depends on import order in the JavaScript entry points, which is not recorded here.

Not every rule in `AppDark.css` is prefixed. `@keyframes`, `.now-playing__img img`, and the `.App-logo` motion media query appear without `.Dark`, so they affect both themes. Both sheets also declare the same keyframes again.
