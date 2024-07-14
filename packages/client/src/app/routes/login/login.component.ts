import { Component, OnInit } from '@angular/core';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { WarningMsgComponent } from '../../shared/components/warning-msg/warning-msg.component';
import { Store } from '@ngrx/store';
import * as UserActions from '../../stores/user/user.actions';
import { Observable } from 'rxjs';
import { selectUserStatus } from '../../stores/user/user.selectors';
import { MAX_PWD, MIN_PWD } from '../../shared/constants/min-max.constant';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		NgStyle,
		NgClass,
		FormInputComponent,
		ButtonComponent,
		WarningMsgComponent,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: [
			'',
			[
				Validators.required,
				Validators.minLength(MIN_PWD),
				Validators.maxLength(MAX_PWD),
			],
		],
	});

	warningMsg = 'empty';
	isShowWarning = false;
	userStatus$: Observable<string>;

	constructor(
		private fb: FormBuilder,
		private store: Store,
		private router: Router,
	) {
		this.userStatus$ = this.store.select(selectUserStatus);
	}

	ngOnInit(): void {
		this.userStatus$.subscribe((userStatus) => {
			switch (userStatus) {
				case 'logged_in': {
					this.router.navigateByUrl('/search');
					break;
				}
				case 'error': {
					this.warningMsg = 'Something went wrong';
					this.isShowWarning = true;
					break;
				}
				case 'unauthorized': {
					this.warningMsg = 'Email or Password is incorrect';
					this.isShowWarning = true;
					break;
				}
			}
		});
	}

	onSubmit(event: Event) {
		// Prevent form for reloading
		event.preventDefault();

		if (!this.loginForm.valid) {
			this.warningMsg = 'Email or Password is incorrect';
			this.isShowWarning = true;
			return;
		}

		this.store.dispatch(UserActions.login(this.loginForm.value));
	}
}
