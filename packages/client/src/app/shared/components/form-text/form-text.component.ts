import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-form-text',
	standalone: true,
	imports: [NgStyle],
	templateUrl: './form-text.component.html',
	styleUrl: './form-text.component.scss',
})
export class FormTextComponent {
	@Input() label: string = 'empty';
	@Input() text: string = 'empty';
	@Input() width: string = '100%';
}
