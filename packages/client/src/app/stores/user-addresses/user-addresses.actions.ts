import { createAction, props } from '@ngrx/store';
import { UserAddr } from '../../shared/interfaces/user-address.model';

// Get
export const getAllUserAddrs = createAction(
	'[Profile Page] Get All User Addrs',
);

export const getAllUserAddrsSuccess = createAction(
	'[User API] Get All User Addrs Success',
	props<{ userAddrs: UserAddr[] }>(),
);

export const getAllUserAddrsFailure = createAction(
	'[User API] Get All User Addrs Failure',
	props<{ error: string }>(),
);

// Post
export const addNewUserAddr = createAction(
	'[Profile Page] Add New User Addr',
	props<{
		address: string;
		subDistrict: string;
		district: string;
		province: string;
		postalCode: string;
	}>(),
);

export const addNewUserAddrSuccess = createAction(
	'[User API] Add New User Addr Success',
	props<{ userAddr: UserAddr }>(),
);

export const addNewUserAddrFailure = createAction(
	'[User API] Add New User Addr Failure',
	props<{ error: string }>(),
);

// Patch
export const updateUserAddr = createAction(
	'[Profile Page] Update User Addr',
	props<{
		_id: string;
		address?: string;
		subDistrict?: string;
		district?: string;
		province?: string;
		postalCode?: string;
	}>(),
);

export const updateUserAddrSuccess = createAction(
	'[User API] Update User Addr Success',
	props<{ userAddr: UserAddr }>(),
);

export const updateUserAddrFailure = createAction(
	'[User API] Update User Addr Failure',
	props<{ error: string }>(),
);

// Delete
export const deleteUserAddr = createAction(
	'[Profile Page] Delete User Addr',
	props<{ _id: string }>(),
);

export const deleteUserAddrSuccess = createAction(
	'[User API] Delete User Addr Success',
	props<{ _id: string }>(),
);

export const deleteUserAddrFailure = createAction(
	'[User API] Delete User Addr Failure',
	props<{ error: string }>(),
);
