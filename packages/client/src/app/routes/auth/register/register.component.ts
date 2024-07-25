import { Component, OnDestroy } from '@angular/core';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { ThridStepComponent } from './components/thrid-step/thrid-step.component';
import { dtAgeValidator } from '../../../shared/validators/datetime-age.validator';
import {
	MAX_NAME,
	MAX_PWD,
	MIN_PWD,
} from '../../../shared/constants/min-max.constant';
import { AuthService } from '../../../apis/auth/auth.service';
import { pwdMatchValidator } from '../../../shared/validators/password-match.validator';
import { Subject, takeUntil } from 'rxjs';
import { dtToUnix } from '../../../shared/utils/dtToUnix';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

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
export class RegisterComponent implements OnDestroy {
	registerForm = new FormGroup<{
		email: FormControl<string>;
		firstName: FormControl<string>;
		lastName: FormControl<string>;
		phone: FormControl<string>;
		birthDate: FormControl<string>;
		password: FormControl<string>;
		confirmPwd: FormControl<string>;
	}>(
		{
			email: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.email],
			}),
			firstName: new FormControl('', {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.pattern('^[A-Za-z]+$'),
					Validators.maxLength(MAX_NAME),
				],
			}),
			lastName: new FormControl('', {
				nonNullable: true,
				validators: [
					Validators.pattern('^[A-Za-z]+$'),
					Validators.maxLength(MAX_NAME),
				],
			}),
			phone: new FormControl('', {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.pattern('^0\\d{9}$'),
				],
			}),
			birthDate: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, dtAgeValidator(12)],
			}), // yyyy-mm-dd
			password: new FormControl('', {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.minLength(MIN_PWD),
					Validators.maxLength(MAX_PWD),
				],
			}),
			confirmPwd: new FormControl('', { nonNullable: true }),
		},
		{ validators: pwdMatchValidator },
	);

	// For changing the form steps
	currStep = 0;

	// For setting and showing the warning message (at step 3)
	warningMsg = 'empty';
	isShowWarning = false;

	// Prevent the memory leak from subscribe
	private destroy$ = new Subject<void>();

	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	changeCurrStep(step: number) {
		this.currStep = step;
	}

	onSubmit(event: Event) {
		event.preventDefault();
		// console.log(this.registerForm);

		// In case of the form accidently able to send when invalid
		if (!this.registerForm.valid) {
			this.warningMsg = 'Something went wrong';
			this.isShowWarning = true;
			return;
		}

		const { email, firstName, lastName, phone, birthDate, password } =
			this.registerForm.getRawValue();

		const birthTime = dtToUnix(birthDate);

		this.authService
			.register({
				email,
				phone,
				password,
				firstName,
				...(lastName && { lastName }),
				birthTime,
			})
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.router.navigateByUrl('/login');
				},
				error: (error) => {
					if (
						error instanceof HttpErrorResponse &&
						error.status === HttpStatusCode.BadRequest
					) {
						this.warningMsg = 'The email is already taken';
						this.isShowWarning = true;
					} else {
						this.warningMsg = 'Something went wrong';
						this.isShowWarning = true;
					}
				},
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
