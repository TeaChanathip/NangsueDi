import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/layouts/navbar/navbar.component';
import { Store } from '@ngrx/store';
import * as UserActions from './stores/user/user.actions';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavbarComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	accessToken: string | null = null;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.accessToken = localStorage.getItem('accessToken');
		if (this.accessToken) {
			// ngrx action for fetching the user data by using accessToken
			this.store.dispatch(UserActions.getUser());
		}
	}
}
