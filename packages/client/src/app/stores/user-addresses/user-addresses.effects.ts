import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserAddrsActions from './user-addresses.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserService } from '../../apis/user/user.service';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AlertsActions from '../alerts/alerts.actions';

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
					map((res: HttpResponse<UserAddr[]>) =>
						UserAddrsActions.getAllUserAddrsSuccess({
							userAddrs: res.body as UserAddr[],
						}),
					),
					catchError((error) =>
						of(UserAddrsActions.getAllUserAddrsFailure({ error })),
					),
				),
			),
		);
	});

	addNewUserAddr$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserAddrsActions.addNewUserAddr),
			mergeMap((action) =>
				this.userService
					.addNewUserAddr({
						address: action.address,
						subDistrict: action.subDistrict,
						district: action.district,
						province: action.province,
						postalCode: action.postalCode,
					})
					.pipe(
						mergeMap((res: HttpResponse<UserAddr>) =>
							of(
								UserAddrsActions.addNewUserAddrSuccess({
									userAddr: res.body as UserAddr,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'address added',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								UserAddrsActions.addNewUserAddrFailure({
									error,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'cannot add a new address',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					),
			),
		);
	});

	updateUserAddr$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserAddrsActions.updateUserAddr),
			mergeMap((action) =>
				this.userService
					.updateUserAddr(action._id, {
						address: action.address,
						subDistrict: action.subDistrict,
						district: action.district,
						province: action.province,
						postalCode: action.postalCode,
					})
					.pipe(
						mergeMap((res: HttpResponse<UserAddr>) =>
							of(
								UserAddrsActions.updateUserAddrSuccess({
									userAddr: res.body as UserAddr,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'address updated',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								UserAddrsActions.updateUserAddrFailure({
									error,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'cannot add update an address',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					),
			),
		);
	});

	deleteUserAddr$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(UserAddrsActions.deleteUserAddr),
			mergeMap((action) =>
				this.userService.deleteUserAddr(action._id).pipe(
					mergeMap((res: HttpResponse<UserAddr>) =>
						of(
							UserAddrsActions.deleteUserAddrSuccess({
								_id: res.body!._id,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'address deleted',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							UserAddrsActions.deleteUserAddrFailure({
								error,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'cannot add delete the address',
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
