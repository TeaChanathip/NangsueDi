import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	ControlContainer,
	FormGroupDirective,
	ReactiveFormsModule,
} from '@angular/forms';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [NgStyle, ReactiveFormsModule],
	viewProviders: [
		{ provide: ControlContainer, useExisting: FormGroupDirective },
	],
	templateUrl: './form-input.component.html',
	styleUrl: './form-input.component.scss',
})
export class FormInputComponent {
	@Input() label: string = 'Empty';
	@Input() type: string = 'text';
	@Input() ph: string = '';
	@Input() formName: string = '';
}
