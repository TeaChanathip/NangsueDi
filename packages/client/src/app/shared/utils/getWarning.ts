import { ValidationErrors } from '@angular/forms';

export function getWarning(validationErrors: ValidationErrors | null): string {
	if (validationErrors === null) {
		return 'empty';
	}

	// get only the first error
	const key = Object.keys(validationErrors)[0];
	const value = validationErrors[key];

	switch (key) {
		case 'required': {
			return 'Required';
		}
		case 'email': {
			return 'Must be an email';
		}
		case 'minlength': {
			return `Must be at least ${value?.requiredLength} characters`;
		}
		case 'maxlength': {
			return `Must not exceed ${value?.requiredLength} characters`;
		}
		case 'pattern': {
			const requiredPattern: string = value?.requiredPattern;
			switch (requiredPattern) {
				case '^[A-Za-z]+$': {
					return 'Must contain only alphabets';
				}
				case '^0\\d{9}$': {
					return 'Must be a Thai phone number';
				}
				default: {
					return 'empty';
				}
			}
		}
		case 'ageLimit': {
			return `Must be at least ${value} years old`;
		}
		default: {
			return 'empty';
		}
	}
}
