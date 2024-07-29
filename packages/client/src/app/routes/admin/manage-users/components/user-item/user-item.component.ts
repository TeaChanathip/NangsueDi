import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../../../../../shared/interfaces/user.model';
import { unixToYMD } from '../../../../../shared/utils/unixToYMD';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AdminUsersActions from '../../../../../stores/admin-users/admin-users.actions';

@Component({
	selector: 'app-user-item',
	standalone: true,
	imports: [NgClass],
	templateUrl: './user-item.component.html',
	styleUrl: './user-item.component.scss',
})
export class UserItemComponent implements OnChanges {
	@Input({ required: true }) user!: User;

	status: 'Non-verified' | 'Verified' | 'Suspended' = 'Non-verified';
	birthDate: string = '';

	constructor(private store: Store) {}

	verify() {
		this.store.dispatch(
			AdminUsersActions.verifyUser({ userId: this.user._id }),
		);
	}

	deleteUser() {
		this.store.dispatch(
			AdminUsersActions.deleteUser({ userId: this.user._id }),
		);
	}

	suspend() {
		this.store.dispatch(
			AdminUsersActions.suspendUser({ userId: this.user._id }),
		);
	}

	unsuspend() {
		this.store.dispatch(
			AdminUsersActions.unsuspendUser({ userId: this.user._id }),
		);
	}

	ngOnChanges(): void {
		// set status
		if (this.user.suspendedAt) {
			this.status = 'Suspended';
		} else if (this.user.permissions) {
			this.status = 'Verified';
		}

		// set birthDate
		this.birthDate = unixToYMD(this.user.birthTime);
	}
}
