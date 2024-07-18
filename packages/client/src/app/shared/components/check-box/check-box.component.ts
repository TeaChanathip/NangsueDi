import { NgStyle } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	ControlContainer,
	FormGroupDirective,
	ReactiveFormsModule,
} from '@angular/forms';

@Component({
	selector: 'app-check-box',
	standalone: true,
	imports: [ReactiveFormsModule, NgStyle],
	viewProviders: [
		{ provide: ControlContainer, useExisting: FormGroupDirective },
	],
	templateUrl: './check-box.component.html',
	styleUrl: './check-box.component.scss',
})
export class CheckBoxComponent implements OnChanges {
	@Input() formName: string | null = null; // when using with form
	@Input() uniqueId!: string | number; // must
	@Input() isChecked: boolean = false;
	@Input() size: string = '20px';

	@Output() checkEvent = new EventEmitter(); // when not using with form

	markSize: string = '0';

	emitEvent() {
		this.checkEvent.emit();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['isChecked']) {
			this.markSize = this.isChecked ? this.size : '0';
		}
	}
}
