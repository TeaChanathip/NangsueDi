import { NgStyle } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';

@Component({
	selector: 'app-state-check-box',
	standalone: true,
	imports: [NgStyle],
	templateUrl: './state-check-box.component.html',
	styleUrl: './state-check-box.component.scss',
})
export class StateCheckBoxComponent implements OnChanges {
	@Input() state: boolean | undefined = undefined;
	@Input() size: string = '28px';
	@Output() toNextState = new EventEmitter();

	checkSize: string = '0';
	removeSize: string = '0';

	onClick() {
		this.toNextState.emit();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['state']) {
			switch (this.state) {
				case undefined: {
					this.checkSize = '0';
					this.removeSize = '0';
					break;
				}
				case true: {
					this.checkSize = this.size;
					this.removeSize = '0';
					break;
				}
				case false: {
					this.checkSize = '0';
					this.removeSize = this.size;
					break;
				}
			}
		}
	}
}
