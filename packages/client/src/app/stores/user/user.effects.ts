import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../apis/auth/auth.service';
import * as UserActions from './user.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LoginRes } from '../../apis/auth/interfaces/login-response.interface';
import {
	HttpErrorResponse,
	HttpResponse,
	HttpStatusCode,
} from '@angular/common/http';
import { UserService } from '../../apis/user/user.service';
import { User } from '../../shared/interfaces/user.model';

@Injectable()
export class UserEffect {
	constructor(
		private actions$: Actions,
		private authService: AuthService,
		private userService: UserService,
	) {}

	login$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserActions.login),
			mergeMap((action) =>
				this.authService
					.login({
						email: action.email,
						password: action.password,
					})
					.pipe(
						map((res: HttpResponse<LoginRes>) => {
							localStorage.setItem(
								'accessToken',
								res.body!.accessToken,
							);
							return UserActions.loginSuccess({
								user: res.body!.user,
							});
						}),
						catchError((error) => {
							if (
								error instanceof HttpErrorResponse &&
								error.status === HttpStatusCode.Unauthorized
							) {
								return of(UserActions.loginUnauthorized());
							}
							return of(UserActions.loginFailure({ error }));
						}),
					),
			),
		);
	});

	logout$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(UserActions.logout),
				map(() => {
					localStorage.removeItem('accessToken');
				}),
			);
		},
		{ dispatch: false },
	);

	getUser$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserActions.getUser),
			mergeMap(() =>
				this.userService.getUser().pipe(
					map((res: HttpResponse<User>) =>
						UserActions.getUserSuccess({
							user: res.body as User,
						}),
					),
					catchError((error) =>
						of(UserActions.getUserFailure({ error })),
					),
				),
			),
		);
	});
}
