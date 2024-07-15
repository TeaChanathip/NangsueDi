import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/interfaces/user.model';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrUser } from '../../../stores/user/user.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import * as UserActions from '../../../stores/user/user.actions';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [RouterModule, AsyncPipe],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
	iconUrl = 'Icon.svg';
	navbarRoutes: [string, string][] = [];
	user$: Observable<User | null>;

	constructor(
		private store: Store,
		private router: Router,
	) {
		this.user$ = this.store.select(selectCurrUser);
	}

	private destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
			if (!user) {
				this.navbarRoutes = [['search', 'navbar-icons/search.svg']];
				return;
			}

			switch (user.role) {
				case 'USER': {
					this.navbarRoutes = [
						['search', 'navbar-icons/search.svg'],
						['my-shelf', 'navbar-icons/my-shelf.svg'],
					];
					break;
				}
				case 'MANAGER': {
					this.navbarRoutes = [
						['search', 'navbar-icons/search.svg'],
						['requests', 'navbar-icons/requests.svg'],
						['manage-books', 'navbar-icons/manage-books.svg'],
					];
					break;
				}
				case 'ADMIN': {
					this.navbarRoutes = [
						['search', 'navbar-icons/search.svg'],
						['requests', 'navbar-icons/requests.svg'],
						['manage-books', 'navbar-icons/manage-books.svg'],
						['manage-users', 'navbar-icons/manage-users.svg'],
						['dashboard', 'navbar-icons/dashboard.svg'],
					];
					break;
				}
				default: {
					this.navbarRoutes = [['search', 'navbar-icons/search.svg']];
				}
			}
		});
	}

	logout(): void {
		this.store.dispatch(UserActions.logout());
		this.router.navigateByUrl('/login');
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
