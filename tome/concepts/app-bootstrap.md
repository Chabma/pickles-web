---
id: concepts/app-bootstrap
kind: concept
refs:
  - src/index.js
  - src/index.css
  - src/reportWebVitals.js
generated: 2114c1b
---
## What it is

`src/index.js` is the runtime entry point for the React application. It imports React, ReactDOM, the root `App` component, an `ErrorBoundary`, the web-vitals reporter, and the global stylesheet, then mounts the tree into the DOM node with id `root`.

The render call wraps `App` in two layers:

- `ErrorBoundary`, which catches errors thrown below it in the tree.
- `React.StrictMode`, which is the outermost wrapper and the direct child passed to `ReactDOM.render`.

Order matters in the file only for imports: `./index.css` is imported last among the imports, so its rules are part of the bundle loaded before the mount call runs. `reportWebVitals()` is called after the render call, not before it.

## Global styles

`src/index.css` sets page-level defaults. `body` hides overflow, removes the default margin, and declares a font stack starting with `"Roboto"` and falling back through system fonts. It also turns on font smoothing for WebKit and Firefox. `code` elements get a monospace stack. Nothing in this file is scoped to a component; it applies to the whole document.

## Web vitals

`src/reportWebVitals.js` exports a function that takes an optional `onPerfEntry` callback. If the argument is a function, it dynamically imports the `web-vitals` package and registers that callback with five metrics: CLS, FID, FCP, LCP, and TTFB. If the argument is missing or not a function, the function does nothing and no import happens.

The entry file calls `reportWebVitals()` with no argument, so no metrics are collected or sent in the current wiring. The commented block above that call shows the intended usage: pass `console.log` or an analytics function to receive entries. Where the metrics would be sent is not recorded.
