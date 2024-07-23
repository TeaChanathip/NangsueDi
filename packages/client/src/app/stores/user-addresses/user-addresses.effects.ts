import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserAddrsActions from './user-addresses.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserService } from '../../apis/user/user.service';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserAddrsEffect {
	constructor(
		private actions$: Actions,
		private userService: UserService,
	) {}

	getAllUserAddrs$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserAddrsActions.getAllUserAddrs),
			mergeMap(() =>
				this.userService.getUserAddrs().pipe(
					map((res: HttpResponse<UserAddr[]>) => {
						return UserAddrsActions.getAllUserAddrsSuccess({
							userAddrs: res!.body as UserAddr[],
						});
					}),
					catchError((error) => {
						return of(
							UserAddrsActions.getAllUserAddrsFailure({ error }),
						);
					}),
				),
			),
		);
	});
}
