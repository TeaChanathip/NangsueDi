import { Component, OnInit } from '@angular/core';
import { ScrollNearEndDirective } from '../../../../../shared/directives/scroll-near-end.directive';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/interfaces/user.model';
import { selectAllAdminUsers } from '../../../../../stores/admin-users/admin-users.selectors';
import * as AdminUsersActions from '../../../../../stores/admin-users/admin-users.actions';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-search-users',
	standalone: true,
	imports: [ScrollNearEndDirective, AsyncPipe],
	templateUrl: './search-users.component.html',
	styleUrl: './search-users.component.scss',
})
export class SearchUsersComponent implements OnInit {
	users$: Observable<User[] | null>;

	limit: number = 20;
	page: number = 1;

	constructor(private store: Store) {
		this.users$ = this.store.select(selectAllAdminUsers);
	}

	ngOnInit(): void {
		this.store.dispatch(
			AdminUsersActions.searchUsers({
				limit: this.limit,
				page: this.page,
			}),
		);
	}
}
