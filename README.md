# Vanilla Validation

_Version 1. Still being worked on slowly. Constructuve feedback appreciated._

Vanilla Validation is a little "set and forget" JavaScript class that leverages the ValidityState API for customised client-side validation. It aims to be accessible and have no external dependencies, and it's a little bit opinionated (hopefully, in a good way).

It's written in modern JavaScript, so you may need to pass it through Babel and polyfill missing functions for older browsers.

## Usage

```
new Validate(formElement [, options]);
```

- `formElement` is any means you choose of getting a _single_ `<form>`. Use querySelector, use getElementById, loop through every form on the page, it's up to you.
- `options` is an optional object containing configuration options, described right now.

### Default configuration

```
{
  showInlineErrors: true,
  showErrorSummary: true,
  disableButtonsOnSubmit: true,
  submitButtonSelector: 'button[type="submit"], input[type="submit"]',
  errorSummaryClass: "error-message-summary",
  inlineErrorClass: "error-message",
  inputsDeferToFieldsets: [],
  i18n: {
    valRequired: "This field is required.",
    valType: "Value doesn't match expected type.",
    valTypeColor: "Value should be a valid hexidecimal code (for example, #786999).",
    valTypeEmail: "Value should be a valid email address (for example, hello@example.com).",
    valTypeNumber: "Value should be a valid number.",
    valTypeTel: "Value should be a valid telephone number.",
    valTypeURL: "Value should be a valid web address, including the protocol (for example, https://example.com).",
    valPattern: "Value doesn't match expected format.",
    valMaxlength: "Value cannot be longer than {1} characters. Currently it's {2} characters.",
    valMinlength: "Value cannot be shorter than {1} characters. Currently it's {2} characters.",
    valMax: "Value must be {1} or less.",
    valMin: "Value must be {1} or more.",
    valStep: "Value must be a multiple of {1}.",
  }
}
```

### Configuration options

- `showInlineErrors` (boolean) Shows error messages above the respective fields. For radio button groups and inputs defined in `inputsDeferToFieldsets`, the error will be shown below the fieldset legend.
- `showErrorSummary` (boolean) Shows a summary of error messages at the top of the form, with links to each invalid input.
- `disableButtonsOnSubmit` (boolean) Disables all `type="submit"` buttons in the form if the form successfully passes validation—and applies `aria-busy="true"`—to prevent multiple clicks sending more than one request.
- `inputsDeferToFieldsets` (array) A list of input `id`s. These IDs will defer to their parent fieldset when gathering error labelling and displaying inline error messaging.
- `inlineErrorClass` (string) Classes to apply to inline errors.
- `errorSummaryClass` (string) Classes to apply to the error summary container.
- `i18n` (object) Object to override the default error messaging, described right now.

### Error messages

Global error messages are defined via the `i18n` configuration option. Individual inputs can display custom error messages, which are defined in HTML using `data-*` attributes.

Some error types allow for the interpolation of additional details within the error message.

| ValidityState type                                                         | HTML attribute  | `i18n` JS config | `data-*` config      | Notes                                                                                                                                                                          |
| :------------------------------------------------------------------------- | :-------------- | :--------------- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [valueMissing](https://caniuse.com/mdn-api_validitystate_valuemissing)     | `required`      | `valRequired`    | `data-val-required`  | Expected a value.                                                                                                                                                              |
| [typeMismatch](https://caniuse.com/mdn-api_validitystate_typemismatch)     | `type`          | `valType`        | `data-val-type`      | Value does not conform to the input's type. This is a generic message used when a more specific mismatch doesn't exist. `{1}` is interpolated to the input's `type` attribute. |
| typeMismatch                                                               | `type="color"`  | `valTypeColor`   |                      | Expected a hexidecimal color value.                                                                                                                                            |
| typeMismatch                                                               | `type="date"`   | `valTypeDate`    |                      | Expected an ISO 8601 date value (YYYY-MM-DD).                                                                                                                                  |
| typeMismatch                                                               | `type="email"`  | `valTypeEmail`   |                      | Expected an RFC 822 formatted email address.                                                                                                                                   |
| typeMismatch                                                               | `type="number"` | `valTypeNumber`  |                      | Expected a numerical value.                                                                                                                                                    |
| typeMismatch                                                               | `type="tel"`    | `valTypeTel`     |                      | Expected a phone number. In practice, browsers rarely validate this type as there are too many possible phone number formats to practically validate against.                  |
| typeMismatch                                                               | `type="url"`    | `valTypeURL`     |                      | Expected a URL (including protocol).                                                                                                                                           |
| [tooLong](https://caniuse.com/mdn-api_validitystate_toolong)               | `maxlength`     | `valMaxlength`   | `data-val-maxlength` | The value provided is longer than the permitted maximum. `{1}` is interpolated to the input's `maxlength` attribute value, `{2}` is the current value's length.                |
| [tooShort](https://caniuse.com/mdn-api_validitystate_tooshort)             | `minlength`     | `valMinlength`   | `data-val-minlength` | The value provided is shorter than the permitted minimum. `{1}` is interpolated to the input's `maxlength` attribute value, `{2}` is the current value's length.               |
| [rangeOverflow](https://caniuse.com/mdn-api_validitystate_rangeoverflow)   | `max`           | `valMax`         | `data-val-max`       | The value is higher than the permitted maximum. `{1}` is interpolated to the input's `max` attribute value, `{2}` is the current value.                                        |
| [rangeUnderflow](https://caniuse.com/mdn-api_validitystate_rangeunderflow) | `min`           | `valMin`         | `data-val-min`       | The value is lower than the permitted minimum. `{1}` is interpolated to the input's `min` attribute value, `{2}` is the current value.                                         |
| [stepMismatch](https://caniuse.com/mdn-api_validitystate_stepmismatch)     | `step`          | `valStep`        | `data-val-step`      | The value is not a multiple of the `step` (plus `min`, if present). `{1}` is interpolated to be the value of the input's `step` attribute.                                     |

If an input has a custom error message currently set via `setCustomValidity`, it will be displayed if none of the above validations are met.

## Opinions

Vanilla Validation is opinionated. That means it makes some (hopefully sensible) assumptions about how your HTML is written and how you want validation to behave.

- All validations are activated and configured via HTML attributes.
- A user's browser must support the specific validation type for it to work. See the table above for CanIUse links for browser support. (And you should be implementing the same validation on the server-side anyway!)
- Inline error messages are always displayed above the input, on the basis that it constitutes the most logical and accessibility-focused reading order (input label asks for a value -> error indicates problem with value -> input field to correct value).
- Radio buttons are always validated in groups, and groups of radio button are expected to always be inside of a fieldset. This is because many validation functions for radio buttons work on a group level, and groups of inputs semantically belong in fieldsets.
- All inputs (be they text, checkbox, select, etc.) that accept validation should have an `id` attribute. This ID is used to link error messaging to the input.
- If a form fails validation, Vanilla Validate will always jump to either the first invalid input or to the error summary (if enabled by `showErrorSummary`).
- If the submit button a user clicks has a `name` attribute, the `name` and `value` will be automatically copied to a hidden input to avoid this information being lost if the button is disabled by `disableButtonsOnSubmit` (this is carried out even if `disableButtonsOnSubmit` is set to false).
- If a `<form>` has the `novalidate` attribute at the point that Vanilla Validation is initialised, Vanilla Validation will not run.
