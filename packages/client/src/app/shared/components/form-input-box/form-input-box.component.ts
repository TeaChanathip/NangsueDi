import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	ControlContainer,
	FormGroupDirective,
	ReactiveFormsModule,
} from '@angular/forms';

@Component({
	selector: 'app-form-input-box',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, NgStyle],
	viewProviders: [
		{ provide: ControlContainer, useExisting: FormGroupDirective },
	],
	templateUrl: './form-input-box.component.html',
	styleUrl: './form-input-box.component.scss',
})
export class FormInputBoxComponent {
	@Input() label: string = 'empty';
	@Input() ph: string = '';
	@Input() maxLength: number | null = null;
	@Input() isRequired: boolean = false;
	@Input() formName: string | null = null;
	@Input() isInvalid: boolean = false;
	@Input() height: string = '100%';
	@Input() readOnly: boolean = false;
}
