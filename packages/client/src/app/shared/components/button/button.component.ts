import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [NgStyle, NgClass],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
	@Input() data: ButtonData = {};

	kind = 'solid';
	width = '130px';
	text = 'Empty';
	isDisabled = false;
	action = (event: Event) => {};

	style = {};

	ngOnInit(): void {
		this.kind = this.data.kind || this.kind;
		this.width = this.data.width || this.width;
		this.text = this.data.text || this.text;
		this.isDisabled = this.data.isDisabled || this.isDisabled;
		this.action = this.data.action || this.action;
	}
}

interface ButtonData {
	kind?: 'solid' | 'outline';
	width?: string;
	text?: string;
	isDisabled?: boolean;
	action?: (event?: Event) => any;
}
