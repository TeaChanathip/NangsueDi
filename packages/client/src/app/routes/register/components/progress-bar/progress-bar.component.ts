import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-progress-bar',
	standalone: true,
	imports: [NgClass],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent implements OnInit {
	@Input() currStep = 0;
	@Input() totalStep = 3;

	@Output() toStepEmitter = new EventEmitter<number>();

	steps: number[] = [];

	ngOnInit(): void {
		this.steps = Array.from(
			{ length: this.totalStep },
			(_, index) => index + 1,
		);
	}

	toStep(step: number) {
		this.toStepEmitter.emit(step);
	}
}
