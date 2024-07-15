import { Component, OnDestroy } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pwdMatchValidator } from '../../shared/validators/password-match.validator';
import { MainFormComponent } from './components/main-form/main-form.component';
import { AuthService } from '../../apis/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MAX_PWD, MIN_PWD } from '../../shared/constants/min-max.constant';
import { FormResultComponent } from '../../shared/components/form-result/form-result.component';

@Component({
	selector: 'app-reset-pwd',
	standalone: true,
	imports: [ReactiveFormsModule, MainFormComponent, FormResultComponent],
	templateUrl: './reset-pwd.component.html',
	styleUrl: './reset-pwd.component.scss',
})
export class ResetPwdComponent implements OnDestroy {
	resetToken = this.activatedRoute.snapshot.params['resetToken'];

	resetPwdForm = new FormGroup<{
		password: FormControl<string>;
		confirmPwd: FormControl<string>;
	}>(
		{
			password: new FormControl('', {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.minLength(MIN_PWD),
					Validators.maxLength(MAX_PWD),
				],
			}),
			confirmPwd: new FormControl('', {
				nonNullable: true,
			}),
		},
		{ validators: pwdMatchValidator },
	);

	error: string | null = null;
	state: 'idel' | 'loading' | 'success' | 'failure' = 'idel';

	private destroy$ = new Subject<void>();

	constructor(
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
	) {}

	onSubmit(event: Event) {
		event.preventDefault();

		this.state = 'loading';

		if (!this.resetPwdForm.valid) {
			this.error = 'Invalid Form Format';
			this.state = 'failure';
		}

		this.authService
			.resetPassword({
				resetToken: this.resetToken,
				newPassword: this.resetPwdForm.get('password')!.value,
			})
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (res: HttpResponse<string>) => {
					console.log(res);
					this.state = 'success';
				},
				error: (error) => {
					console.log(error);
					this.state = 'failure';
				},
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
