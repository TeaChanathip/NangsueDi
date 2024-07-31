import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-requests',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './requests.component.html',
	styleUrl: './requests.component.scss',
})
export class RequestsComponent {}
