import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLayout } from './core/layouts/navbar/navbar.layout.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavbarLayout],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'client';
}
