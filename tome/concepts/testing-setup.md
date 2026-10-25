---
id: concepts/testing-setup
kind: concept
refs:
  - src/setupTests.js
  - src/App.test.js
  - src/App.js#App
generated: 2114c1b
---
## What it is

The test setup spans two files. `src/setupTests.js` runs before the test files and imports `@testing-library/jest-dom`, which adds DOM matchers such as `toBeInTheDocument` to Jest's `expect`. It contains no other setup, mocks, or global configuration.

`src/App.test.js` is the example component test. It imports `render` and `screen` from `@testing-library/react`, imports `App` from `./App`, renders `<App />`, finds an element by text with `screen.getByText(/learn react/i)`, and asserts it is in the document. This establishes the convention: render the component, query through `screen`, assert with jest-dom. It is the only test shown.

The suite runs in the Create React App Jest environment. `App` expects browser globals during import and construction: `window.location`, `document.documentElement`, and `navigator` for media session calls. It also imports stylesheets, images, jQuery, Ant Design, and tsparticles. Those imports must resolve for the test to load.

A mismatch is visible: the test looks for text matching "learn react", while the `App` source shown does not render that string. The test reads as the default CRA sample rather than a check of the current UI. Nothing in these files mocks the Spotify API, the player SDK, `window.particlesJS`, or `Audio`, so tests that render `App` use the ambient jsdom environment as-is. Why the default assertion remains is not recorded.
