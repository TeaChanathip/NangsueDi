import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Borrow } from '../../../shared/interfaces/borrow.model';
import { Store } from '@ngrx/store';
import { selectAllMgrBrrws } from '../../../stores/manager-borrows/manager-borrows.selectors';
import * as MgrBrrwsActions from '../../../stores/manager-borrows/manager-borrows.actions';
import { AsyncPipe } from '@angular/common';
import { RequestItemComponent } from './components/request-item/request-item.component';

@Component({
	selector: 'app-requests',
	standalone: true,
	imports: [AsyncPipe, RequestItemComponent],
	templateUrl: './requests.component.html',
	styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnInit {
	userBrrwsReqs$: Observable<Borrow[] | null>;

	limit: number = 40;
	page: number = 1;

	constructor(private store: Store) {
		this.userBrrwsReqs$ = this.store.select(selectAllMgrBrrws);
	}

	ngOnInit(): void {
		this.store.dispatch(
			MgrBrrwsActions.getUserBrrwsReqs({
				limit: this.limit,
				page: this.page,
			}),
		);
	}
}
