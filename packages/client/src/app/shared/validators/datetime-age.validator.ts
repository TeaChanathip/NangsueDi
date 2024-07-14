import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dtAgeValidator(age: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (!value) {
			return null;
		}

		const birthDate = new Date(value); // UTC datetime
		const today = new Date(); // Server's timezone datetime

		let yrs = today.getFullYear() - birthDate.getFullYear();
		const mths = today.getMonth() - birthDate.getMonth();

		if (mths < 0 || (mths === 0 && today.getDate() < birthDate.getDate())) {
			yrs--;
		}

		if (yrs < age) {
			return { ageLimit: age };
		}

		return null;
	};
}
