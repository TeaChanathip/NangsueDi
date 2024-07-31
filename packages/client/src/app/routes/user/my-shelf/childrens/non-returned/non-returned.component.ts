import { Component, OnInit } from '@angular/core';
import { Borrow } from '../../../../../shared/interfaces/borrow.model';
import { combineLatest, map, Observable } from 'rxjs';
import { selectAllBorrows } from '../../../../../stores/borrows/borrows.selectors';
import { Store } from '@ngrx/store';
import * as BorrowsActions from '../../../../../stores/borrows/borrows.actions';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { unixToYMD } from '../../../../../shared/utils/unixToYMD';
import * as ReturnActions from '../../../../../stores/returns/returns.actions';
import { Return } from '../../../../../shared/interfaces/return.model';
import { selectAllReturns } from '../../../../../stores/returns/returns.selectors';

@Component({
	selector: 'app-non-returned',
	standalone: true,
	imports: [AsyncPipe, ButtonComponent],
	templateUrl: './non-returned.component.html',
	styleUrl: './non-returned.component.scss',
})
export class NonReturnedComponent implements OnInit {
	borrows$: Observable<Borrow[] | null>; // Approved & nonReturned
	returns$: Observable<Return[] | null>; // Pending

	filteredBrrws$: Observable<Borrow[] | null>;

	constructor(private store: Store) {
		this.borrows$ = this.store.select(selectAllBorrows);
		this.returns$ = this.store.select(selectAllReturns);

		this.filteredBrrws$ = combineLatest([
			this.borrows$,
			this.returns$,
		]).pipe(
			map(([borrows, returns]) => {
				if (!borrows || !returns) {
					return borrows;
				}

				const returnIds = new Set(returns.map((ret) => ret.borrowId));
				return borrows.filter((borrow) => !returnIds.has(borrow._id));
			}),
		);
	}

	returnBook(borrowId: string) {
		this.store.dispatch(ReturnActions.returnBook({ borrowId }));
	}

	unixToYMD(unix: number): string {
		return unixToYMD(unix);
	}

	ngOnInit(): void {
		this.store.dispatch(
			BorrowsActions.getBrrwsAndReturn({
				bProps: {
					isApproved: 1,
					isReturned: 0,
				},
				rProps: {
					isApproved: 0,
					isRejected: 0,
				},
			}),
		);
	}
}
