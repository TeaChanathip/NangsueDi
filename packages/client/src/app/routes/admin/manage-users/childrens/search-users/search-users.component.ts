import { Component, OnInit } from '@angular/core';
import { ScrollNearEndDirective } from '../../../../../shared/directives/scroll-near-end.directive';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
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
			validators: [Validators.pattern('^0\\d{9}$')],
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
	isVerified: boolean | undefined = undefined;
	isSuspended: boolean | undefined = undefined;
	roles: boolean[] = new Array<boolean>(false);

	limit: number = 20;
	page: number = 1;

	isFormChange$: Observable<boolean>;

	constructor(private store: Store) {
		this.users$ = this.store.select(selectAllAdminUsers);

		this.isFormChange$ = this.searchUsersForm.valueChanges.pipe(
			map(
				({ email, firstName, lastName, phone }) =>
					!(email || firstName || lastName || phone),
			),
		);
	}

	resetForm(event: Event) {
		event.stopPropagation();
		this.searchUsersForm.reset();
	}

	toggleRoles(index: number) {
		this.roles[index] = !this.roles[index];
	}

	changeIsVerifiedState() {
		switch (this.isVerified) {
			case undefined: {
				this.isVerified = true;
				break;
			}
			case true: {
				this.isVerified = false;
				break;
			}
			case false: {
				this.isVerified = undefined;
				break;
			}
		}
	}

	changeIsSuspendedState() {
		switch (this.isSuspended) {
			case undefined: {
				this.isSuspended = true;
				break;
			}
			case true: {
				this.isSuspended = false;
				break;
			}
			case false: {
				this.isSuspended = undefined;
				break;
			}
		}
	}

	onSubmitForm() {
		return () =>
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
