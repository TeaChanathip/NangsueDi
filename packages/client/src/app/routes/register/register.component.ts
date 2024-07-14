import { Component } from '@angular/core';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { ThridStepComponent } from './components/thrid-step/thrid-step.component';
import { dtAgeValidator } from '../../shared/validators/datetime-age.validator';
import {
	MAX_NAME,
	MAX_PWD,
	MIN_PWD,
} from '../../shared/constants/min-max.constant';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		ProgressBarComponent,
		FormInputComponent,
		FirstStepComponent,
		SecondStepComponent,
		ThridStepComponent,
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	registerForm = this.fb.group(
		{
			email: ['', [Validators.required, Validators.email]],
			firstName: [
				'',
				[
					Validators.required,
					Validators.pattern('^[A-Za-z]+$'),
					Validators.maxLength(MAX_NAME),
				],
			],
			lastName: [
				'',
				[
					Validators.pattern('^[A-Za-z]+$'),
					Validators.maxLength(MAX_NAME),
				],
			],
			phoneNumber: [
				'',
				[Validators.required, Validators.pattern('^0\\d{9}$')],
			],
			birthDate: ['', [Validators.required, dtAgeValidator(12)]], // yyyy-mm-dd
			password: [
				'',
				[
					Validators.required,
					Validators.minLength(MIN_PWD),
					Validators.maxLength(MAX_PWD),
				],
			],
			confirmPwd: [''],
		},
		{ validator: pwdMatchValidator },
	);

	currStep = 0;

	constructor(private fb: FormBuilder) {}

	changeCurrStep(step: number) {
		this.currStep = step;
	}

	onSubmit(event: Event) {
		event.preventDefault();
		console.log(this.registerForm);
	}
}

function pwdMatchValidator(g: FormGroup) {
	return g.get('password')?.value === g.get('confirmPwd')?.value
		? null
		: { pwdMismatch: true };
}
