import { createAction, props } from '@ngrx/store';
import { UserAddr } from '../../shared/interfaces/user-address.model';

export const getAllUserAddrs = createAction(
	'[Profile Page] Get All User Addrs',
);

export const getAllUserAddrsSuccess = createAction(
	'[Profile Page] Get All User Addrs Success',
	props<{ userAddrs: UserAddr[] }>(),
);

export const getAllUserAddrsFailure = createAction(
	'[Profile Page] Get All User Addrs Failure',
	props<{ error: string }>(),
);
