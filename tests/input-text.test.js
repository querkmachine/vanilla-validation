const path = require("path");
const commonTests = require("./_common");

beforeAll(async () => {
	await page.goto(`file:${path.join(__dirname, "input-text.html")}`, { waitUntil: "load" });
	// Type a too short value into inputMinlength
	await page.type("#inputMinlength", "A", { delay: 100 });
	// Type an invalid pattern into inputPattern
	await page.type("#inputPattern", "A", { delay: 100 });
	// inputMaxlength already has a pre-populated value in HTML.
	// We wanna delete some characters from that value as the browser doesn't
	// activate validation if we edit the value programmatically.
	// See README for more info.
	await page.focus("#inputMaxlength");
	await page.keyboard.press("Delete");
	await page.keyboard.press("Backspace");
	// Submit
	await page.click("#submitWithValidation");
});

describe("inputNoConstraints", () => {
	commonTests.testInputInvalid("inputNoConstraints", false);
	commonTests.testValidationMessaging("inputNoConstraints", false);
});

describe("inputRequired", () => {
	commonTests.testInputInvalid("inputRequired", true);
	commonTests.testValidationMessaging("inputRequired", true);
});

describe("inputMinlength", () => {
	commonTests.testInputInvalid("inputMinlength", true);
	commonTests.testValidationMessaging("inputMinlength", true);
});

describe("inputMaxlength", () => {
	commonTests.testInputInvalid("inputMaxlength", true);
	commonTests.testValidationMessaging("inputMaxlength", true);
});

describe("inputPattern", () => {
	commonTests.testInputInvalid("inputPattern", true);
	commonTests.testValidationMessaging("inputPattern", true);
});