import { Component, OnInit } from '@angular/core';
import { ScrollNearEndDirective } from '../../../../../shared/directives/scroll-near-end.directive';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';
import { User } from '../../../../../shared/interfaces/user.model';
import { selectAllAdminUsers } from '../../../../../stores/admin-users/admin-users.selectors';
import * as AdminUsersActions from '../../../../../stores/admin-users/admin-users.actions';
import { AsyncPipe, NgClass } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClearButtonComponent } from '../../../../../shared/components/clear-button/clear-button.component';
import { CheckBoxComponent } from '../../../../../shared/components/check-box/check-box.component';
import { StateCheckBoxComponent } from '../../../../../shared/components/state-check-box/state-check-box.component';
import { MAX_EMAIL } from '../../../../../shared/constants/min-max.constant';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
	selector: 'app-search-users',
	standalone: true,
	imports: [
		ScrollNearEndDirective,
		AsyncPipe,
		ReactiveFormsModule,
		MatExpansionModule,
		ClearButtonComponent,
		CheckBoxComponent,
		StateCheckBoxComponent,
		NgClass,
		ButtonComponent,
	],
	templateUrl: './search-users.component.html',
	styleUrl: './search-users.component.scss',
})
export class SearchUsersComponent implements OnInit {
	users$: Observable<User[] | null>;

	searchUsersForm = new FormGroup({
		email: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.maxLength(MAX_EMAIL)],
		}),
		phone: new FormControl<string>('', {
			nonNullable: true,
			validators: [
				Validators.pattern('^[0-9]+$'),
				Validators.maxLength(10),
			],
		}),
		firstName: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.pattern('^[A-Za-z]+$')],
		}),
		lastName: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.pattern('^[A-Za-z]+$')],
		}),
	});
	isVerified$ = new BehaviorSubject<boolean | undefined>(undefined);
	isSuspended$ = new BehaviorSubject<boolean | undefined>(undefined);
	roles$ = new BehaviorSubject<boolean[]>(new Array<boolean>(3).fill(false));

	limit: number = 20;
	page: number = 1;

	disableBtn$: Observable<boolean>;

	constructor(private store: Store) {
		this.users$ = this.store.select(selectAllAdminUsers);

		this.disableBtn$ = merge(
			this.searchUsersForm.valueChanges,
			this.isVerified$,
			this.isSuspended$,
			this.roles$,
		).pipe(
			map(() => {
				const { email, firstName, lastName, phone } =
					this.searchUsersForm.value;
				const isVerified = this.isVerified$.getValue();
				const isSuspended = this.isSuspended$.getValue();
				const roles = this.roles$.getValue();

				return (
					email == '' &&
					firstName == '' &&
					lastName == '' &&
					phone == '' &&
					isVerified == undefined &&
					isSuspended == undefined &&
					roles.every((item) => !item)
				);
			}),
		);
	}

	resetForm(event: Event) {
		event.stopPropagation();
		this.searchUsersForm.reset();

		this.isVerified$.next(undefined);
		this.isSuspended$.next(undefined);
		this.roles$.next(new Array<boolean>(3).fill(false));
	}

	toggleRoles(index: number) {
		const next = this.roles$.getValue();
		next[index] = !next[index];

		this.roles$.next(next);
	}

	changeIsVerifiedState() {
		switch (this.isVerified$.getValue()) {
			case undefined: {
				this.isVerified$.next(true);
				break;
			}
			case true: {
				this.isVerified$.next(false);
				break;
			}
			case false: {
				this.isVerified$.next(undefined);
				break;
			}
		}
	}

	changeIsSuspendedState() {
		switch (this.isSuspended$.getValue()) {
			case undefined: {
				this.isSuspended$.next(true);
				break;
			}
			case true: {
				this.isSuspended$.next(false);
				break;
			}
			case false: {
				this.isSuspended$.next(undefined);
				break;
			}
		}
	}

	onSubmitForm() {
		if (!this.searchUsersForm.valid) return;

		this.store.dispatch(
			AdminUsersActions.searchUsers({
				...this.searchUsersForm.getRawValue(),
				limit: this.limit,
				page: this.page,
			}),
		);
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
