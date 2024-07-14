import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-result',
	standalone: true,
	imports: [],
	templateUrl: './result.component.html',
	styleUrl: './result.component.scss',
})
export class ResultComponent {
	@Input() error: string | null = 'null';
	@Input() state: 'idel' | 'loading' | 'success' | 'failure' = 'loading';
}
