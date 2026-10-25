---
id: src/AppDark.css
kind: file
refs:
  - src/AppDark.css
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.App-logo
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
  - src/AppDark.css#.Dark
generated: 2114c1b
---
## What it is

`src/AppDark.css` is the dark-theme stylesheet for the app. Almost every rule is prefixed with `.Dark`, so the styles only apply when that class is on a parent element. Unprefixed rules leak to the light theme.

## Layout shell

- `.App`, `#root`, `.App-header` and `.App-main` set heights and stacking so the page fills the viewport without scrolling the body.
- `.App-main` is declared twice (lines 23 and 34). The second block wins: column flex, centered items, a bottom border, hidden horizontal overflow, and a 30px bottom margin.
- `.main-wrapper` is a horizontally scrolling flex container at 95% height.
- `#logo`, `#logo_text` and `#account_image` float left/right inside the header.

## Panels

- Recommendations: `.next-wrapper` holds a horizontally scrolling strip; `#nextPlayer` is a flex row at 33% height; `#refresh-div` and `#refresh_btn` size the refresh control.
- `.Search` caps width at 800px. Later rules give the search card a translucent grey background and lighten result title and description text so it stays readable.
- Settings use `.settings_header` (light bar) and `.settings` (open panel).
- Now Playing and queue rules split image and side columns 50/50 and constrain `#queue`, `#played_queue` and the Ant card body.

## Repeated and notable blocks

- `.now-playing__name`, `__artist`, `__img` and `__side` appear twice; the later set uses `calc()` sizes and purple text, overriding the first.
- `.now-playing__img img` has no `.Dark` prefix, so it applies in both themes.
- Ant Design elements are restyled: selectors, list items, cards, input wrapper.
- `#particles-js` is a fixed-size background layer at `z-index: -2`. Why it exists beyond decoration is not recorded.
- Scrollbar width and thumb colour are set through WebKit pseudo-elements.

## Motion

`Login-hover` moves and rotates `.App-logo` over 30 seconds, only when the user has no reduced-motion preference. `App-logo-spin` is defined but nothing in this file uses it.
