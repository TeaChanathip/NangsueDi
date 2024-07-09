import { Component } from '@angular/core';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		NgStyle,
		NgClass,
		FormInputComponent,
		ButtonComponent,
		RouterModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	isShowWarning = false;
}
