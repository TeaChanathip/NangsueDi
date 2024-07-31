import { Component, Input } from '@angular/core';
import { Borrow } from '../../../../../shared/interfaces/borrow.model';
import { FormTextComponent } from '../../../../../shared/components/form-text/form-text.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import * as MgrBrrwsActions from '../../../../../stores/manager-borrows/manager-borrows.actions';

@Component({
	selector: 'app-request-item',
	standalone: true,
	imports: [FormTextComponent, ButtonComponent],
	templateUrl: './request-item.component.html',
	styleUrl: './request-item.component.scss',
})
export class RequestItemComponent {
	@Input() request!: Borrow;

	constructor(private store: Store) {}

	approve() {
		this.store.dispatch(
			MgrBrrwsActions.approveBrrw({ borrowId: this.request._id }),
		);
	}

	reject() {
		this.store.dispatch(
			MgrBrrwsActions.rejectBrrw({
				borrowId: this.request._id,
				rejectReason: 'empty',
			}),
		);
	}
}
