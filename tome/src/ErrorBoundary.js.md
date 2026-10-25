---
id: src/ErrorBoundary.js
kind: file
refs:
  - src/ErrorBoundary.js
  - src/ErrorBoundary.js#ErrorBoundary
  - src/ErrorBoundary.js#constructor
  - src/ErrorBoundary.js#componentDidCatch
  - src/ErrorBoundary.js#render
generated: 2114c1b
---
## What it is

`src/ErrorBoundary.js` exports a React class component named `ErrorBoundary`. It wraps part of the app and catches errors thrown by components below it during rendering, so a crash shows a message instead of an empty screen.

## Error capture

- The constructor sets `this.state = { error: null }`.
- `static getDerivedStateFromError(error)` returns `{ error }`, which React uses to move the caught error into state.
- `componentDidCatch(error, info)` logs `"Pickles crashed:"` along with the error and info through `console.error`. It then tries to write the error message and stack to `sessionStorage` under the key `picklesLastCrash`. That write sits inside a `try` with an empty `catch`, so a storage failure (for example a quota or blocked-storage error) is silently ignored.

The on-screen text says the error was saved and points to Settings → Show Debug after reloading. Where that stored key is read is not recorded in this file.

## Rendering

`render()` checks `this.state.error`:

- **If an error is set**, it returns a full-screen dark panel (`minHeight: "100vh"`, 24px padding, centered sans-serif white text) containing:
  - the heading "Something went wrong";
  - the error's `message` as a string, shown small in salmon (`#ff9a9a`) with whitespace preserved and long words broken;
  - a grey hint about the saved error and Settings → Show Debug;
  - a "Reload Pickles" button whose click handler calls `window.location.reload()`.
- **If no error is set**, it returns `this.props.children` unchanged.

On the normal path the component is a pass-through and adds no markup. After a crash it stays in the error state, because nothing in this file resets `this.state.error`; recovery happens only through the page reload.
