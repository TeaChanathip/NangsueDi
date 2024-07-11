import { Component, OnInit } from '@angular/core';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';
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
import { selectAllUserStatus } from '../../stores/user/user.selectors';
import { AppState } from '../../stores/app.state';

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
				Validators.minLength(6),
				Validators.maxLength(100),
			],
		],
	});

	isShowWarning = false;
	userStatus$: Observable<any>;

	constructor(
		private fb: FormBuilder,
		private store: Store<AppState>,
	) {
		this.userStatus$ = this.store.select(selectAllUserStatus);
	}

	ngOnInit(): void {
		this.userStatus$.subscribe((userStatus) => {
			switch (userStatus) {
				case 'logged_in': {
					console.log('logged in');
					break;
				}
				case 'error': {
					console.log('error');
					break;
				}
				case 'unauthorized': {
					console.log('unauthorized');
					break;
				}
			}
		});
	}

	onSubmit(event: Event) {
		// Prevent form for reloading
		event.preventDefault();

		if (!this.loginForm.valid) {
			this.isShowWarning = true;
			return;
		}

		console.log('sending....', this.loginForm.value);
		this.store.dispatch(UserActions.login(this.loginForm.value));
	}
}
