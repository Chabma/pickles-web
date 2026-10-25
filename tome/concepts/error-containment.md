---
id: concepts/error-containment
kind: concept
refs:
  - src/ErrorBoundary.js#ErrorBoundary
  - src/index.js
  - src/App.js#App
generated: 2114c1b
---
## What it is

`ErrorBoundary` is a class component at the root of the app. In `src/index.js`, it wraps `<App />` inside `React.StrictMode`, so a render failure below `App` lands on this one component. The root boundary is the only one in these files.

- `getDerivedStateFromError(error)` stores the error in `state.error`.
- `componentDidCatch(error, info)` logs `"Pickles crashed:"` to the console and writes the error message and stack to `sessionStorage` under `picklesLastCrash`. The write is inside `try/catch`, so storage failures do not raise another error.
- `render()` returns `props.children` while `state.error` is null. Once an error is stored, it returns the fallback: a dark full-height panel, the heading "Something went wrong", the error message, a note that the error was saved and to open Settings → Show Debug after reloading, and a reload button.

The fallback replaces the whole tree, including the player and queue. Its only action is `window.location.reload()`, so recovery is a full page restart. The displayed text uses only `error.message`; the stack is available through session storage.

The boundary sees errors React raises during rendering, in constructors, and in lifecycle methods below it. It does not see failures inside `App`'s fetch `.catch` handlers or click handlers, which handle their own errors and update state. Those paths never reach `ErrorBoundary`.
