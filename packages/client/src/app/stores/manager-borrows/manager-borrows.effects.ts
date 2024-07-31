import { Injectable } from '@angular/core';
import { ManagerService } from '../../apis/manager/manager.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MgrBrrwsActions from './manager-borrows.actions';
import * as AlertsActions from '../alerts/alerts.actions';
import { catchError, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Borrow } from '../../shared/interfaces/borrow.model';

@Injectable()
export class MgrBrrwsEffect {
	constructor(
		private actions$: Actions,
		private managerService: ManagerService,
	) {}

	getUserBrrwsReqs$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrBrrwsActions.getUserBrrwsReqs),
			mergeMap((action) =>
				this.managerService
					.getBorrows({
						bookKeyword: action.bookKeyword,
						isApproved: action.isApproved,
						isReturned: action.isReturned,
						limit: action.limit,
						page: action.page,
					})
					.pipe(
						mergeMap((res: HttpResponse<Borrow[]>) =>
							of(
								MgrBrrwsActions.getUserBrrwsReqsSuccess({
									borrows: res.body as Borrow[],
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'get user borrows requests',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								MgrBrrwsActions.getUserBrrwsReqsFailure({
									error,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'cannot get user borrows requests',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					),
			),
		);
	});

	approveBrrw$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrBrrwsActions.approveBrrw),
			mergeMap((action) =>
				this.managerService.approveBorrow(action.borrowId).pipe(
					mergeMap((res: HttpResponse<Borrow>) =>
						of(
							MgrBrrwsActions.approveBrrwSuccess({
								borrow: res.body as Borrow,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'approve borrow request',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							MgrBrrwsActions.approveBrrwFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'approve borrow request',
									msg: 'Please try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});

	rejectBrrw$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(MgrBrrwsActions.rejectBrrw),
			mergeMap((action) =>
				this.managerService
					.rejectBorrow(action.borrowId, action.rejectReason)
					.pipe(
						mergeMap((res: HttpResponse<Borrow>) =>
							of(
								MgrBrrwsActions.rejectBrrwSuccess({
									borrow: res.body as Borrow,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'reject borrow request',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								MgrBrrwsActions.rejectBrrwFailure({ error }),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'reject borrow request',
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
