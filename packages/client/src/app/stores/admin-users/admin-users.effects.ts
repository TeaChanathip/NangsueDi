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
						roles: action.roles,
						canBorrow: action.canBorrow,
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
}
