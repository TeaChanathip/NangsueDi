import {
	AbstractControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';

export function dtDurationValidator(
	controlName: string,
	beginSuffix: string = 'Begin',
	endSuffix: string = 'End',
): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!(control instanceof FormGroup)) return null;

		const g = control as FormGroup;

		const begin = g.get(`${controlName}${beginSuffix}`)?.value;
		const end = g.get(`${controlName}${endSuffix}`)?.value;

		const beginDate = new Date(begin);
		const endDate = new Date(end);

		if (beginDate && endDate && beginDate > endDate) {
			return { [`${controlName}`]: true };
		}

		return null;
	};
}
