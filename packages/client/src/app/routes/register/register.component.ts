import { Component } from '@angular/core';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ProgressBarComponent, FormInputComponent],
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
		birthDate: ['', [Validators.required, Validators.pattern('^0\\d{9}$')]],
	});

	currStep = 0;

	constructor(private fb: FormBuilder) {}
}
