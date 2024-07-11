import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-progress-bar',
	standalone: true,
	imports: [NgClass],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent implements OnInit {
	@Input() currStep: number = 0;
	@Input() totalStep: number = 3;

	steps: number[] = [];

	ngOnInit(): void {
		this.steps = Array.from(
			{ length: this.totalStep },
			(_, index) => index + 1,
		);
	}

	changeStep($index: number) {
		this.currStep = $index;
	}
}
