import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function pwdMatchValidator(
	control: AbstractControl,
): ValidationErrors | null {
	if (!(control instanceof FormGroup)) return null;

	const g = control as FormGroup;

	const password = g.get('password')?.value;
	const confirmPwd = g.get('confirmPwd')?.value;

	if (password && password !== confirmPwd) {
		return { pwdMismatch: true };
	}

	return null;
}
