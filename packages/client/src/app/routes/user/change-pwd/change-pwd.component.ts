import { Component, OnDestroy } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MAX_PWD, MIN_PWD } from '../../../shared/constants/min-max.constant';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../apis/user/user.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MainFormComponent } from './components/main-form/main-form.component';
import { FormResultComponent } from '../../../shared/components/form-result/form-result.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as UserActions from '../../../stores/user/user.actions';

@Component({
	selector: 'app-change-pwd',
	standalone: true,
	imports: [ReactiveFormsModule, MainFormComponent, FormResultComponent],
	templateUrl: './change-pwd.component.html',
	styleUrl: './change-pwd.component.scss',
})
export class ChangePwdComponent implements OnDestroy {
	changePwdForm = new FormGroup<{
		password: FormControl<string>;
		newPwd: FormControl<string>;
	}>({
		password: new FormControl('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.minLength(MIN_PWD),
				Validators.maxLength(MAX_PWD),
			],
		}),
		newPwd: new FormControl('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.minLength(MIN_PWD),
				Validators.maxLength(MAX_PWD),
			],
		}),
	});

	error: string | null = null;
	state: 'idel' | 'loading' | 'success' | 'failure' = 'idel';

	private destroy$ = new Subject<void>();
	private timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

	constructor(
		private userService: UserService,
		private store: Store,
		private router: Router,
	) {}

	onSubmit(event: Event) {
		event.preventDefault();

		this.state = 'loading';

		if (!this.changePwdForm.valid) {
			this.error = 'Invalid Form Format';
			this.state = 'failure';
		}

		this.userService
			.changePassword({
				password: this.changePwdForm.get('password')!.value,
				newPassword: this.changePwdForm.get('newPwd')!.value,
			})
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.state = 'success';
					this.store.dispatch(UserActions.logout());

					this.timeoutId = setTimeout(() => {
						this.router.navigateByUrl('/login');
					}, 3000);
				},
				error: (error) => {
					if (
						error instanceof HttpErrorResponse &&
						error.status === HttpStatusCode.Unauthorized
					) {
						this.error = 'The old password is incorrect';
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

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}
}
