import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Borrow } from '../../../../../shared/interfaces/borrow.model';
import { Store } from '@ngrx/store';
import { selectAllBorrows } from '../../../../../stores/borrows/borrows.selectors';
import * as BorrowsActions from '../../../../../stores/borrows/borrows.actions';
import { unixToYMD } from '../../../../../shared/utils/unixToYMD';

@Component({
	selector: 'app-pending',
	standalone: true,
	imports: [AsyncPipe, ButtonComponent],
	templateUrl: './pending.component.html',
	styleUrl: './pending.component.scss',
})
export class PendingComponent implements OnInit {
	borrows$: Observable<Borrow[] | null>; // Approved & nonReturned

	constructor(private store: Store) {
		this.borrows$ = this.store.select(selectAllBorrows);
	}

	cancelBorrow(borrowId: string) {
		this.store.dispatch(BorrowsActions.cancelBorrow({ borrowId }));
	}

	unixToYMD(unix: number): string {
		return unixToYMD(unix);
	}

	ngOnInit(): void {
		this.store.dispatch(
			BorrowsActions.getBrrws({
				isApproved: 0,
				isRejected: 0,
				isReturned: 0,
			}),
		);
	}
}
