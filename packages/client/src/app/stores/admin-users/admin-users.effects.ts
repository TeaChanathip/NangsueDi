import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AdminService } from '../../apis/admin/admin.service';
import * as AdminUsersActions from './admin-users.actions';
import * as AlertsActions from '../alerts/alerts.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../shared/interfaces/user.model';

@Injectable()
export class AdminUsersEffect {
	constructor(
		private actions$: Actions,
		private adminService: AdminService,
	) {}

	searchUsers$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AdminUsersActions.searchUsers),
			mergeMap((action) =>
				this.adminService
					.searchUsers({
						email: action.email,
						phone: action.phone,
						firstName: action.firstName,
						lastName: action.lastName,
						isVerified: action.isVerified,
						isSuspended: action.isSuspended,
						roles: action.roles,
						limit: action.limit,
						page: action.page,
					})
					.pipe(
						map((res: HttpResponse<User[]>) =>
							AdminUsersActions.searchUsersSuccess({
								users: res.body as User[],
							}),
						),
						catchError((error) =>
							of(
								AdminUsersActions.searchUsersFailure({ error }),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'cannot search users',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					),
			),
		);
	});

	verifyUser$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AdminUsersActions.verifyUser),
			mergeMap((action) =>
				this.adminService.verifyUser(action.userId).pipe(
					mergeMap((res: HttpResponse<User>) =>
						of(
							AdminUsersActions.verifyUserSuccess({
								user: res.body as User,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'user was verified',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							AdminUsersActions.verifyUserFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'something went wrong',
									msg: 'Pleas try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});

	deleteUser$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AdminUsersActions.deleteUser),
			mergeMap((action) =>
				this.adminService.deleteUser(action.userId).pipe(
					mergeMap((res: HttpResponse<User>) =>
						of(
							AdminUsersActions.deleteUserSuccess({
								user: res.body as User,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'user was verified',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							AdminUsersActions.deleteUserFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'something went wrong',
									msg: 'Pleas try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});

	suspendUser$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AdminUsersActions.suspendUser),
			mergeMap((action) =>
				this.adminService.suspendUser(action.userId).pipe(
					mergeMap((res: HttpResponse<User>) =>
						of(
							AdminUsersActions.suspendUserSuccess({
								user: res.body as User,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'user was suspended',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							AdminUsersActions.suspendUserFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'something went wrong',
									msg: JSON.stringify(error),
								},
							}),
						),
					),
				),
			),
		);
	});

	unsuspendUser$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AdminUsersActions.unsuspendUser),
			mergeMap((action) =>
				this.adminService.unsuspendUser(action.userId).pipe(
					mergeMap((res: HttpResponse<User>) =>
						of(
							AdminUsersActions.unsuspendUserSuccess({
								user: res.body as User,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'user was unsuspended',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							AdminUsersActions.unsuspendUserFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'something went wrong',
									msg: 'Pleas try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});
}
