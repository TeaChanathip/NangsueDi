import { Component, OnInit } from '@angular/core';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
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

	warningMsg = 'Empty';
	isShowWarning = false;
	userStatus$: Observable<any>;

	constructor(
		private fb: FormBuilder,
		private store: Store<AppState>,
		private router: Router,
	) {
		this.userStatus$ = this.store.select(selectAllUserStatus);
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

		console.log('sending....', this.loginForm.value);
		this.store.dispatch(UserActions.login(this.loginForm.value));
	}
}
