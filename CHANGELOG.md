# 1.3.0 (2021-10-19)

Adds IIFE (in-browser compatible) export.

There are now three distributed versions of Vanilla Validation available:

- validate.min.js (IIFE, can be used directly in a browser)
- validate.js (CommonJS/UMD, can be used with `require`)
- validate.mjs (ESM, can be used with `import`)

# 1.2.1 (2021-09-08)

The build process changes in 1.2.0 inadvertently changed Vanilla Validation from using a default export to a named export, introducing a breaking change as it required the importing code to be modified appropriately. 

This release corrects the issue and returns the library to using a default export. 

# 1.2.0 (2021-09-07)

This release overhauls the build process to make Vanilla Validation easier to use when added as a dependency through npm. The library itself is functionally identical to previous versions. 

There are now separate CommonJS/UMD (validate.js) and ESM (validate.mjs) versions of Vanilla Validation. Most build tools should be able to determine which version to use automatically. Both come pre-minified and with source maps provided. 

# 1.1.1 (2021-09-07)

- Fixed Validate class not being exported.

# 1.1.0 (2021-09-01)

- Added missing support for the `formnovalidate` attribute.
- Added `[type="image"]` to the default submit button selector.
- An error is now displayed in the browser console if an input is missing a label.

# 1.0.0 (2021-07-15)

- Initial release.