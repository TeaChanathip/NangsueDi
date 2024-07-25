import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-warning-msg',
	standalone: true,
	imports: [NgClass],
	templateUrl: './warning-msg.component.html',
	styleUrl: './warning-msg.component.scss',
})
export class WarningMsgComponent {
	@Input() msg: string = 'empty';
	@Input() enAni: boolean = false;
	@Input() isShowing: boolean = true;
}
