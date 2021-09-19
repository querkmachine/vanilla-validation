# The petty foibles of browser validation

Some notes on tests that are impossible to pass.

## Pre-populated values with `minlength`

Chrome/Chromium, Firefox and Safari will not mark an input as invalid if a pre-populated `value` is shorter than `minlength` permits.

If you need to validate `minlength` on a pre-populated value, you can reliably generate a response by using the `pattern` attribute. e.g. `<input type="text" pattern=".{5,}">`. This is not available on textareas, however.

Applies to tests:

- input-text -> inputMinlength (tests for programmatic input only)

## `maxlength`

Like `minlength`, Chrome/Chromium, Firefox and Safari will not mark an input as invalid if a pre-populated `value` is longer than `maxlength`. Unlike `minlength`, they also won't mark it as invalid if the value is made longer than `maxlength` programmatically (i.e. via JavaScript).

The only instance in which any of these browsers will run the `tooLong` validation is if the pre-populated `value` is longer than `maxlength` and the user changes it to a value that is still longer than `maxlength`, for example if the `maxlength` is 5, the pre-populated `value` is 10 characters long, and the user deletes 2 characters.

Other than that edge case, browsers effectively don't implement the `tooLong` validation, probably because their UIs actively prevent a user from typing a value longer than `maxlength` allows anyway.

Applies to tests:

- input-text -> inputMaxlength (tests for edited pre-populated value only)