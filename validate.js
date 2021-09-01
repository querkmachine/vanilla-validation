class Validate {
  constructor($form, options = {}) {
    // If the form has the `novalidate` attribute, quit out
    if ($form.noValidate) {
      return;
    }
    // Create settings object
    this.settings = Object.assign(
      {},
      {
        showInlineErrors: true,
        showErrorSummary: true,
        disableButtonsOnSubmit: true,
        submitButtonSelector: '[type="submit"], [type="image"]',
        errorSummaryClass: "error-message-summary",
        inlineErrorClass: "error-message",
        inputsDeferToFieldsets: [], // array of input IDs
        i18n: {
          valRequired: "This field is required.",
          valType: "Value doesn't match expected type.",
          valTypeColor:
            "Value should be a valid hexidecimal code (for example, #786999).",
          valTypeEmail:
            "Value should be a valid email address (for example, hello@example.com).",
          valTypeNumber: "Value should be a valid number.",
          valTypeTel: "Value should be a valid telephone number.",
          valTypeURL:
            "Value should be a valid web address, including the protocol (for example, https://example.com).",
          valPattern: "Value doesn't match expected format.",
          valMaxlength:
            "Value cannot be longer than {1} characters. Currently it's {2} characters.",
          valMinlength:
            "Value cannot be shorter than {1} characters. Currently it's {2} characters.",
          valMax: "Value must be {1} or less.",
          valMin: "Value must be {1} or more.",
          valStep: "Value must be a multiple of {1}.",
        },
      },
      options
    );
    // Gather some elements
    this.$form = $form;
    this.$submitButtons = [
      ...$form.querySelectorAll(this.settings.submitButtonSelector),
    ];
    // Track form state
    this.clickedSubmitButton = null;
    this.errorList = [];
    // Go
    this.create();
  }
  create() {
    // Add `novalidate` to form
    this.$form.setAttribute("novalidate", "novalidate");
    // Bind events
    this.$form.bindFormSubmit = this.onSubmit.bind(this);
    this.$form.bindSubmitClick = this.onClickSubmit.bind(this);
    this.$form.addEventListener("submit", this.$form.bindFormSubmit);
    this.$submitButtons.forEach(($button) => {
      $button.addEventListener("click", this.$form.bindSubmitClick);
    });
  }
  destroy() {
    this.clearErrors();
    // Remove attributes
    this.$form.removeAttribute("novalidate");
    // Remove listeners
    this.$form.removeEventListener("submit", this.$form.bindFormSubmit);
    this.$submitButtons.forEach(($button) => {
      $button.removeEventListener("click", this.$form.bindSubmitClick);
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.errorList = this.findErrors();
    if (this.errorList.length > 0) {
      // Form is not valid, show the errors
      this.printErrors();
    } else {
      // Form is valid
      this.submitForm();
    }
  }
  onClickSubmit(e) {
    // Track which button was clicked
    this.clickedSubmitButton = e.currentTarget;
  }
  findErrors() {
    // Clear existing errors
    this.clearErrors();
    // Grab all the inputs and loop over them, gathering info on the ones that report invalid.
    const $inputs = [...this.$form.querySelectorAll("input, textarea, select")];
    $inputs.forEach(($input) => {
      if (!$input.validity.valid) {
        this.errorList.push({
          $element: $input,
          $fieldset: this.shouldInputDeferToFieldset($input)
            ? $input.closest("fieldset")
            : null,
          id: $input.id,
          name: $input.name,
          label: this.getInputLabel($input),
          errorMessage: this.getInputErrorMessage($input),
        });
      }
    });
    // Return error list
    return this.errorList;
  }
  printErrors() {
    // Mark invalid inputs
    this.errorList.forEach((error) => {
      error.$element.setAttribute("aria-invalid", "true");
    });
    // Loop through and output inline errors
    if (this.settings.showInlineErrors) {
      this.errorList.forEach((error) => {
        // Create error label
        const $parentNode = error.$element.parentNode;
        const errorId = `${error.id || error.name}-Error`;
        const describedBy = [
          error.$element.getAttribute("aria-describedby") || null,
          errorId,
        ];
        // If the error message already exists in the DOM, don't add it again
        if (!document.getElementById(errorId)) {
          const $errorLabel = document.createElement("div");
          $errorLabel.id = errorId;
          $errorLabel.classList.add(this.settings.inlineErrorClass);
          $errorLabel.innerText = error.errorMessage;
          // If this input defers to fieldset (always true if $fieldset is populated)
          // we want to place the error at the fieldset level
          if (error.$fieldset) {
            // There's no insertAfter function yet, so we have to get the next sibling then insert before it
            const $fieldsetLegendSibling = error.$fieldset.querySelector(
              "legend"
            ).nextSibling;
            error.$fieldset.insertBefore($errorLabel, $fieldsetLegendSibling);
          } else {
            $parentNode.insertBefore($errorLabel, error.$element);
          }
        }
        // Associate it with the input
        error.$element.setAttribute("aria-describedby", describedBy.join(" "));
      });
    }
    // Create error summary
    if (this.settings.showErrorSummary) {
      const displayedErrors = [];
      const $summaryContainer = document.createElement("div");
      const $summaryList = document.createElement("ul");
      $summaryContainer.setAttribute("role", "alert");
      $summaryContainer.setAttribute("tabindex", -1);
      $summaryContainer.classList.add(this.settings.errorSummaryClass);
      this.errorList.forEach((error) => {
        // If this error hasn't already been rendered...
        if (error.id && !displayedErrors.includes(error.id)) {
          const $summaryItem = document.createElement("li");
          const $summaryItemLink = document.createElement("a");
          $summaryItemLink.href = `#${error.id}`;
          $summaryItemLink.innerText = `${error.label}: ${error.errorMessage}`;
          $summaryItem.appendChild($summaryItemLink);
          $summaryList.appendChild($summaryItem);
          displayedErrors.push(error.id);
        }
      });
      $summaryContainer.appendChild($summaryList);
      this.$form.prepend($summaryContainer);
    }
    // Move focus to error summary or first invalid input
    if (this.settings.showErrorSummary) {
      const $errorSummary = this.$form.querySelector(
        `.${this.settings.errorSummaryClass}`
      );
      if ($errorSummary) {
        $errorSummary.focus();
      }
    } else {
      const $errorInputs = this.$form.querySelectorAll("[aria-invalid]");
      if ($errorInputs.length > 0) {
        $errorInputs[0].focus();
      }
    }
  }
  clearErrors() {
    // Remove aria-invalid and aria-describedby attributes from inputs
    this.errorList.forEach((error) => {
      const $input = error.$element;
      $input.removeAttribute("aria-invalid");
      let describedBy = $input.getAttribute("aria-describedby");
      describedBy = describedBy.replace(`${error.id}-Error`, "").trim();
      if (describedBy.length) {
        $input.setAttribute("aria-describedby", describedBy);
      } else {
        $input.removeAttribute("aria-describedby");
      }
    });
    // Get inline error elements and remove 'em all
    if (this.settings.showInlineErrors) {
      const $errorMessages = this.$form.getElementsByClassName(
        this.settings.inlineErrorClass
      );
      [...$errorMessages].forEach(($error) => $error.remove());
    }
    // Remove error summary
    if (this.settings.showErrorSummary) {
      const $errorSummary = this.$form.querySelector(
        `.${this.settings.errorSummaryClass}`
      );
      if ($errorSummary) {
        $errorSummary.remove();
      }
    }
    // Clear error list
    this.errorList = [];
  }
  shouldInputDeferToFieldset($input) {
    // Radio buttons live in groups, which SHOULD always be in fieldsets.
    if ($input.type === "radio") {
      return true;
    }
    // We can also configure certain inputs to defer to the fieldset in some instances (e.g. multi-part date inputs).
    return this.settings.inputsDeferToFieldsets.includes($input.id);
  }
  getInputLabel($input) {
    // If deferring to fieldset, we want to get the fieldset legend rather than the input's individual label.
    if (this.shouldInputDeferToFieldset($input)) {
      const legend = $input.closest("fieldset")?.querySelector("legend")
        ?.innerText;
      if (legend) {
        return legend.trim();
      }
    }
    // For everything else, just the input label should do.
    if(!$input.labels.length) {
      console.error("Form element doesn't have associated label.", $input);
      return "";
    }
    return $input.labels[0].innerText.trim();
  }
  getInputErrorMessage($input) {
    // Default error message. This is also where any custom error messaging being rolled will be populated.
    let errorMessage = $input.validationMessage;
    // Required field is empty
    if ($input.validity.valueMissing) {
      errorMessage =
        $input.dataset.valRequired || this.settings.i18n.valRequired;
    }
    // Type mismatch
    else if ($input.validity.typeMismatch) {
      if ($input.dataset.valType) {
        errorMessage = this.formatErrorMessage(
          $input.dataset.valType,
          $input.type
        );
      } else {
        switch ($input.type) {
          case "color":
            errorMessage = this.settings.i18n.valTypeColor;
            break;
          case "date":
            errorMessage = this.settings.i18n.valTypeDate;
            break;
          case "email":
            errorMessage = this.settings.i18n.valTypeEmail;
            break;
          case "number":
            errorMessage = this.settings.i18n.valTypeNumber;
            break;
          case "tel":
            errorMessage = this.settings.i18n.valTypeTel;
            break;
          case "url":
            errorMessage = this.settings.i18n.valTypeURL;
            break;
          default:
            errorMessage = this.formatErrorMessage(
              this.settings.i18n.valType,
              $input.type
            );
            break;
        }
      }
    }
    // Pattern mismatch
    else if ($input.validity.patternMismatch) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valPattern || this.settings.i18n.valPattern,
        $input.attributes.pattern.value
      );
    }
    // Too long
    else if ($input.validity.tooLong) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valMaxlength || this.settings.i18n.valMaxlength,
        $input.attributes.maxlength.value,
        $input.value.length
      );
    }
    // Too short
    else if ($input.validity.tooShort) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valMinlength || this.settings.i18n.valMinlength,
        $input.attributes.minlength.value,
        $input.value.length
      );
    }
    // Range overflow
    else if ($input.validity.rangeOverflow) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valMax || this.settings.i18n.valMax,
        $input.attributes.max.value
      );
    }
    // Range underflow
    else if ($input.validity.rangeUnderflow) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valMin || this.settings.i18n.valMin,
        $input.attributes.min.value
      );
    }
    // Step mismatch
    else if ($input.validity.stepMismatch) {
      errorMessage = this.formatErrorMessage(
        $input.dataset.valStep || this.settings.i18n.valStep,
        $input.attributes.step.value
      );
    }
    // Return error message
    return errorMessage;
  }
  formatErrorMessage(string, ...subs) {
    for (let i = 0; i < subs.length; i++) {
      string = string.replace(`{${i + 1}}`, subs[i]);
    }
    return string;
  }
  submitForm() {
    // Disable all the submit buttons to avoid double-dipping
    if (this.settings.disableButtonsOnSubmit) {
      this.$submitButtons.forEach(($button) => {
        $button.disabled = true;
        $button.setAttribute("aria-busy", "true");
      });
    }
    // Check to see if the submit button they clicked had anything important
    if (this.clickedSubmitButton && this.clickedSubmitButton.name) {
      // This button has a name, and potentially a value!
      // The button has been disabled, which means it won't send the name
      // value with the request anymore, but we don't wanna lose that info
      // so let's make an input[type="hidden"] to stash it in.
      const $submitButtonData = document.createElement("input");
      $submitButtonData.type = "hidden";
      $submitButtonData.name = this.clickedSubmitButton.name;
      $submitButtonData.value = this.clickedSubmitButton.value;
      this.$form.appendChild($submitButtonData);
    }
    // Resume submitting the form
    this.$form.submit();
  }
}
