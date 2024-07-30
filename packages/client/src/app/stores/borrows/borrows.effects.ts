import { Injectable } from '@angular/core';
import { BorrowService } from '../../apis/borrow/borrow.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BorrowsActions from './borrows.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Borrow } from '../../shared/interfaces/borrow.model';
import * as AlertsActions from '../alerts/alerts.actions';

@Injectable()
export class BorrowsEffect {
	constructor(
		private actions$: Actions,
		private borrowService: BorrowService,
	) {}

	getNonRetBrrws$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BorrowsActions.getNonRetBrrws),
			mergeMap(() =>
				this.borrowService.getNonReturned().pipe(
					map((res: HttpResponse<Borrow[]>) =>
						BorrowsActions.getNonRetBrrwsSuccess({
							borrows: res.body as Borrow[],
						}),
					),
					catchError((error) =>
						of(
							BorrowsActions.getNonRetBrrwsFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'fetching non-returned borrows',
								},
							}),
						),
					),
				),
			),
		);
	});

	borrowBook$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BorrowsActions.borrowBook),
			mergeMap((action) =>
				this.borrowService
					.borrowBook(action.bookId, action.addrId)
					.pipe(
						mergeMap((res: HttpResponse<Borrow>) =>
							of(
								BorrowsActions.borrowBookSuccess({
									borrow: res.body as Borrow,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'borrow',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								BorrowsActions.borrowBookFailure({ error }),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'brrow',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					),
			),
		);
	});
}
