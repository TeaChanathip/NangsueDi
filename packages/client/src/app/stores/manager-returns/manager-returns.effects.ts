import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ManagerService } from '../../apis/manager/manager.service';
import * as MgrRetsActions from './manager-returns.actions';
import { catchError, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Return } from '../../shared/interfaces/return.model';
import * as AlertsActions from '../alerts/alerts.actions';

@Injectable()
export class MgrRetsEffect {
	constructor(
		private actions$: Actions,
		private managerService: ManagerService,
	) {}

	getUserRetsReqs$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrRetsActions.getUserReturns),
			mergeMap((action) =>
				this.managerService
					.getReturns({
						bookKeyword: action.bookKeyword,
						borrowIdQuery: action.borrowIdQuery,
						isApproved: action.isApproved,
						isRejected: action.isRejected,
						limit: action.limit,
						page: action.page,
					})
					.pipe(
						mergeMap((res: HttpResponse<Return[]>) =>
							of(
								MgrRetsActions.getUserReturnsSuccess({
									returns: res.body as Return[],
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'get returns',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								MgrRetsActions.getUserReturnsFailure({ error }),
								AlertsActions.pushAlert({
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

	approveReturn$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrRetsActions.approveReturns),
			mergeMap((action) =>
				this.managerService.approveReturn(action.returnId).pipe(
					mergeMap((res: HttpResponse<Return>) =>
						of(
							MgrRetsActions.approveReturnsSuccess({
								returnObj: res.body as Return,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'approve returns',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							MgrRetsActions.approveReturnsFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'approve returns',
									msg: 'Please try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});

	rejectReturn$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrRetsActions.rejectReturns),
			mergeMap((action) =>
				this.managerService.rejectReturn(action.returnId).pipe(
					mergeMap((res: HttpResponse<Return>) =>
						of(
							MgrRetsActions.rejectReturnsSuccess({
								returnObj: res.body as Return,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'reject returns',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							MgrRetsActions.rejectReturnsFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'reject returns',
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
