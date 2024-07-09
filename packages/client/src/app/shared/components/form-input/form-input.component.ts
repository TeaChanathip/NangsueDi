import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [NgStyle],
	templateUrl: './form-input.component.html',
	styleUrl: './form-input.component.scss',
})
export class FormInputComponent {
	@Input() data: {
		label?: string;
		type?: string;
		ph?: string;
	} = { label: 'Empty', type: 'text', ph: '' };
}
