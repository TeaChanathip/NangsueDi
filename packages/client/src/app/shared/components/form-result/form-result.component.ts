import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-form-result',
	standalone: true,
	imports: [],
	templateUrl: './form-result.component.html',
	styleUrl: './form-result.component.scss',
})
export class FormResultComponent {
	@Input() error: string | null = 'null';
	@Input() state: 'idel' | 'loading' | 'success' | 'failure' = 'loading';
}
