import { Component } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pwdMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
	selector: 'app-reset-pwd',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './reset-pwd.component.html',
	styleUrl: './reset-pwd.component.scss',
})
export class ResetPwdComponent {
	resetToken = this.activatedRoute.snapshot.params['resetToken'];

	resetPwdForm = new FormGroup(
		{
			password: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.email],
			}),
			confirmPwd: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.email],
			}),
		},
		{ validators: pwdMatchValidator },
	);

	constructor(private activatedRoute: ActivatedRoute) {}

	onSubmit(event: Event) {
		event.preventDefault();
	}
}
