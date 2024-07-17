import {
	AbstractControl,
	FormControl,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';

export function arrayEachValidator(...validtors: ValidatorFn[]): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (!value || !Array.isArray(value)) {
			return null;
		}

		const errors: ValidationErrors[] = [];
		value.forEach((item, index) => {
			const itemControl = new FormControl<typeof item>(item);
			validtors.forEach((validator) => {
				const result = validator(itemControl);
				if (result) {
					errors.push({
						[index]: result,
					});
				}
			});
		});

		if (errors.length > 0) {
			return { arrayEachValidator: errors };
		}

		return null;
	};
}
