import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-clear-button',
	standalone: true,
	imports: [],
	templateUrl: './clear-button.component.html',
	styleUrl: './clear-button.component.scss',
})
export class ClearButtonComponent {
	@Input() disabled: boolean = true;
	@Output() clicked = new EventEmitter();

	emitEvent(event: Event) {
		this.clicked.emit(event);
	}
}
