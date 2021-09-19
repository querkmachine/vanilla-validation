const testInputInvalid = function (elementId, expectTruthy = true) {
	it(`should${expectTruthy ? '': ' not'} be marked as invalid`, async () => {
		const isInvalid = (await page.$(`#${elementId}[aria-invalid]`)) || false;
		expectTruthy ? expect(isInvalid).toBeTruthy() : expect(isInvalid).toBeFalsy();
	});
}

const testValidationMessaging = function (elementId, expectTruthy = true) {
	it(`should${expectTruthy ? '': ' not'} produce a validation message`, async () => {
		const isValidationMessageVisible = (await page.$(`#${elementId}-Error`)) || false;
		expectTruthy ? expect(isValidationMessageVisible).toBeTruthy() : expect(isValidationMessageVisible).toBeFalsy();
	});
	
	it(`should${expectTruthy ? '': ' not'} link input to its validation message`, async () => {
		const isValidationMessageVisible = (await page.$(`[aria-describedby~='${elementId}-Error']`)) || false;
		expectTruthy ? expect(isValidationMessageVisible).toBeTruthy() : expect(isValidationMessageVisible).toBeFalsy();
	});
	
	it(`should${expectTruthy ? '': ' not'} create summary link to input`, async () => {
		const isValidationMessageVisible = (await page.$(`[href='#${elementId}']`)) || false;
		expectTruthy ? expect(isValidationMessageVisible).toBeTruthy() : expect(isValidationMessageVisible).toBeFalsy();
	});
}

module.exports = {
	testInputInvalid,
	testValidationMessaging
}