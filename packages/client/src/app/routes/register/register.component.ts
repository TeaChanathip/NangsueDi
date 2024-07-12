import { Component } from '@angular/core';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { ThridStepComponent } from './components/thrid-step/thrid-step.component';

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
	registerForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		firstName: [
			'',
			[
				Validators.required,
				Validators.pattern('^[A-Za-z]+$'),
				Validators.maxLength(100),
			],
		],
		lastName: [
			'',
			[Validators.pattern('^[A-Za-z]+$'), Validators.maxLength(100)],
		],
		phoneNumber: [
			'',
			[Validators.required, Validators.pattern('^0\\d{9}$')],
		],
		// need unix time validator
		birthDate: ['', [Validators.required]],
	});

	currStep = 0;

	constructor(private fb: FormBuilder) {}

	changeCurrStep(step: number) {
		this.currStep = step;
	}
}
