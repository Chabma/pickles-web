---
id: src/setupTests.js
kind: file
refs:
  - src/setupTests.js
generated: 2114c1b
---
## What it is

`src/setupTests.js` is a Jest setup file. It contains one statement: an import of `@testing-library/jest-dom`. The file itself defines no functions, classes, or exported values.

```js
import "@testing-library/jest-dom";
```

## What the import does

`@testing-library/jest-dom` extends Jest's `expect` with DOM-aware matchers. After the import runs, assertions can target elements rather than raw values. The comment in the file gives one example:

```js
expect(element).toHaveTextContent(/react/i)
```

The matchers that arrive with this package include checks for text content, visibility, presence in the document, attributes, classes, form values, and accessibility state. The import has no name binding because the package works by side effect: it registers matchers on the global `expect`.

## How the file gets used

The file exports nothing and is never imported by application code. Create React App's test tooling looks for a file at this exact path and runs it before each test file, alongside the Jest environment. That ordering matters: the matchers must be registered before any test calls them, and putting the import in a setup file avoids repeating it in every test.

Because the setup runs per test file, matcher registration happens fresh in each test's module context. This is the intended arrangement and requires no cleanup code here.

## Why it is minimal

The file holds only the DOM matcher setup. Any global mocks, environment variables, or console silencing would also live in a setup file like this one, but none are present. Whether the project adds such setup elsewhere is not recorded in this file.

The trailing comment links to the package documentation for the full matcher list. The directory name `src` and the filename `setupTests.js` follow the Create React App convention rather than anything defined in this file.
