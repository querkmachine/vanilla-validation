# 1.2.0

This release overhauls the build process to make Vanilla Validation easier to use when added as a dependency through npm. The library itself is functionally identical to previous versions. 

There are now separate CommonJS/UMD (validate.js) and ESM (validate.mjs) versions of Vanilla Validation. Most build tools should be able to determine which version to use automatically. Both come pre-minified and with source maps provided. 

# 1.1.1

- Fixed Validate class not being exported.

# 1.1.0

- Added missing support for the `formnovalidate` attribute.
- Added `[type="image"]` to the default submit button selector.
- An error is now displayed in the browser console if an input is missing a label.

# 1.0.0

- Initial release.