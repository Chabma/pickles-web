---
id: src/reportWebVitals.js
kind: file
refs:
  - src/reportWebVitals.js
  - src/reportWebVitals.js#reportWebVitals
generated: 2114c1b
---
## What it is

A small module that exports one function, `reportWebVitals`, as the default export. It is a helper for measuring browser performance metrics and passing them to a callback the caller supplies.

## How it works

The function takes a single argument, `onPerfEntry`. Before doing anything else it checks two things:

- that `onPerfEntry` is truthy (not `undefined`, `null`, or some other empty value)
- that `onPerfEntry instanceof Function`

If either check fails, the function does nothing at all. There is no error, no warning, and no return value. The check exists to confirm the caller passed a real function before attempting to call it.

When a function is passed, the module loads the `web-vitals` package with a dynamic `import()`. This is asynchronous: the package is only fetched when `reportWebVitals` is actually called with a valid callback, not when the module itself is imported. The promise that `import()` returns is not captured, awaited, or given a `.catch` handler.

## The metrics

Once the package resolves, the callback receives five metric functions from the destructured module:

- `getCLS` — cumulative layout shift
- `getFID` — first input delay
- `getFCP` — first contentful paint
- `getLCP` — largest contentful paint
- `getTTFB` — time to first byte

Each is invoked in turn with `onPerfEntry` as its only argument. The `web-vitals` library calls that callback whenever the corresponding metric is reported.

## Notes

The ordering of the five calls is fixed in the source. Nothing is returned, and there is no cleanup or unsubscribe path. Where the caller wires this up is not recorded here.
