import { Component } from '@angular/core';
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
import { AuthService } from '../../apis/auth/auth.service';
import { User } from '../../shared/interfaces/user.model';
import { WarningMsgComponent } from '../../shared/components/warning-msg/warning-msg.component';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';

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
export class LoginComponent {
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
	user: User | undefined;
	isShowWarning = false;

	constructor(
		private readonly fb: FormBuilder,
		private readonly authService: AuthService,
	) {}

	async onSubmit(event: Event) {
		// Prevent form for reloading
		event.preventDefault();

		if (!this.loginForm.valid) {
			this.isShowWarning = true;
			return;
		}

		this.authService
			.login(this.loginForm.value)
			.subscribe((res: HttpResponse<loginResBody>) => {
				if (res.status != HttpStatusCode.Created || !res.body) {
					this.isShowWarning = true;
					return;
				}

				localStorage.setItem('accessToken', res.body.accessToken);
			});
	}
}

interface loginResBody {
	accessToken: string;
	user: User;
}
