---
id: src/index.css
kind: file
refs:
  - src/index.css
generated: 2114c1b
---
## What it is

A global CSS file with two element rules. It sets base appearance for the whole page and for monospaced text. It contains no CSS variables, media queries, or class selectors, and the source carries no comments explaining intent.

## The `body` rule

- `overflow: hidden` stops the document from scrolling; any content taller than the viewport is clipped rather than reachable by scroll. Why this is wanted is not recorded, though it is consistent with an app shell that manages its own scrolling regions.
- `margin: 0` removes the browser's default body margin so content sits flush against the window edges.
- `font-family` sets the page font. `"Roboto"` is listed first, so it is used only if present on the machine. The rest of the list is a fallback chain of system UI fonts, ending in the generic `sans-serif`.
- `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` change how text is rendered by WebKit and by Firefox on macOS, generally making glyphs thinner. Both are vendor-prefixed and ignored by browsers that do not support them.

## The `code` rule

`code` elements get a monospace font stack starting with `source-code-pro`, then `Menlo`, `Monaco`, `Consolas`, `"Courier New"`, and finally the generic `monospace` keyword. As with the body rule, the named fonts are used only when installed locally; no font files are loaded by this stylesheet.

```css
code { font-family: source-code-pro, Menlo, ... , monospace; }
```

Nothing here sets colours, sizes, spacing, or line heights, so those values come from the browser defaults or from other stylesheets.
