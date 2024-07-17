import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dtBeforeValidator(before: Date): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (!value) {
			// If there's no value, there's nothing to validate
			return null;
		}

		const inputDate = new Date(value);
		// Reset hours, minutes, seconds, and milliseconds to ensure we're only comparing dates
		inputDate.setHours(0, 0, 0, 0);
		const comparisonDate = new Date(before);
		comparisonDate.setHours(0, 0, 0, 0);

		if (inputDate > comparisonDate) {
			// If the input date is not before the specified date, return an error
			return { dtBefore: { valid: false, before: before } };
		}

		// If the input date is before the specified date, validation passes
		return null;
	};
}
