import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [NgStyle, NgClass],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
})
export class ButtonComponent {
	@Input() formType: '' | 'submit' = '';
	@Input() kind: 'solid' | 'outline' = 'solid';
	@Input() text: string = 'empty';
	@Input() width: string = '130px';
	@Input() color: 'green' | 'red' = 'green';
	@Input() isDisabled: boolean = false;
	@Input() action = () => {};
}
