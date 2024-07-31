import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReturnService } from '../../apis/return/return.service';
import * as ReturnsActions from './returns.actions';
import { catchError, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Return } from '../../shared/interfaces/return.model';
import * as AlertsAction from '../alerts/alerts.actions';

@Injectable()
export class ReturnsEffect {
	constructor(
		private actions$: Actions,
		private returnService: ReturnService,
	) {}

	returnBook$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(ReturnsActions.returnBook),
			mergeMap((action) =>
				this.returnService.returnBook(action.borrowId).pipe(
					mergeMap((res: HttpResponse<Return>) =>
						of(
							ReturnsActions.returnBookSuccess({
								returnObj: res.body as Return,
							}),
							// dispatch borrow action

							AlertsAction.pushAlert({
								alert: {
									kind: 'success',
									header: 'return book',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							ReturnsActions.returnBookFailure({ error }),
							AlertsAction.pushAlert({
								alert: {
									kind: 'fail',
									header: 'return book',
									msg: 'Please try again later',
								},
							}),
						),
					),
				),
			),
		);
	});

	getReturns$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(ReturnsActions.getReturns),
			mergeMap((action) =>
				this.returnService
					.getReturns({
						bookKeyword: action.bookKeyword,
						borrowId: action.borrowId,
						isApproved: action.isApproved,
						isRejected: action.isRejected,
						limit: action.limit,
						page: action.page,
					})
					.pipe(
						mergeMap((res: HttpResponse<Return[]>) =>
							of(
								ReturnsActions.getReturnsSuccess({
									returns: res.body as Return[],
								}),
								AlertsAction.pushAlert({
									alert: {
										kind: 'success',
										header: 'get returns',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								ReturnsActions.getReturnsFailure({ error }),
								AlertsAction.pushAlert({
									alert: {
										kind: 'fail',
										header: 'get returns',
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
