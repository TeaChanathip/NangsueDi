import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RequestItemComponent } from '../../components/request-item/request-item.component';
import { Borrow } from '../../../../../shared/interfaces/borrow.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllMgrBrrws } from '../../../../../stores/manager-borrows/manager-borrows.selectors';
import * as MgrBrrwsActions from '../../../../../stores/manager-borrows/manager-borrows.actions';

@Component({
	selector: 'app-manager-borrows-requests',
	standalone: true,
	imports: [AsyncPipe, RequestItemComponent],
	templateUrl: './manager-borrows-requests.component.html',
	styleUrl: './manager-borrows-requests.component.scss',
})
export class ManagerBorrowsRequestsComponent implements OnInit {
	userBrrwsReqs$: Observable<Borrow[] | null>;

	limit: number = 40;
	page: number = 1;

	constructor(private store: Store) {
		this.userBrrwsReqs$ = this.store.select(selectAllMgrBrrws);
	}

	ngOnInit(): void {
		this.store.dispatch(
			MgrBrrwsActions.getUserBrrwsReqs({
				isApproved: 0,
				isRejected: 0,
				isReturned: 0,
				// limit: this.limit,
				// page: this.page,
			}),
		);
	}
}
