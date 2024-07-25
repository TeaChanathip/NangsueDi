import { Component, OnDestroy } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../../apis/auth/auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { MainFormComponent } from './components/main-form/main-form.component';
import { FormResultComponent } from '../../../shared/components/form-result/form-result.component';

@Component({
	selector: 'app-forgot-pwd',
	standalone: true,
	imports: [ReactiveFormsModule, MainFormComponent, FormResultComponent],
	templateUrl: './forgot-pwd.component.html',
	styleUrl: './forgot-pwd.component.scss',
})
export class ForgotPwdComponent implements OnDestroy {
	forgotPwdForm = new FormGroup({
		email: new FormControl('', {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
	});

	warningMsg: string = 'Required';
	isShowWarning: boolean = true;

	error: string | null = null;
	state: 'idel' | 'loading' | 'success' | 'failure' = 'idel';

	private destroy$ = new Subject<void>();

	constructor(private authService: AuthService) {}

	onSubmit(event: Event) {
		event.preventDefault();

		this.state = 'loading';

		this.authService
			.forgotPassword(this.forgotPwdForm.getRawValue()['email'])
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.state = 'success';
				},
				error: (error) => {
					if (
						error instanceof HttpErrorResponse &&
						error.status === HttpStatusCode.BadRequest
					) {
						this.error = 'The email is incorrect';
					} else {
						this.error = 'Something went wrong';
					}

					this.state = 'failure';
				},
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
