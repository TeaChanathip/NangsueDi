import { createReducer, on } from '@ngrx/store';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import * as UserAddrsAction from './user-addresses.actions';

export interface UserAddrsState {
	userAddrs: UserAddr[] | null;
	error: string | null;
	status: 'pending' | 'loading' | 'success' | 'error';
}

export const initialState: UserAddrsState = {
	userAddrs: null,
	error: null,
	status: 'pending',
};

export const userAddrsReducer = createReducer(
	initialState,

	on(
		UserAddrsAction.getAllUserAddrs,
		(state): UserAddrsState => ({
			...state,
			userAddrs: null,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserAddrsAction.getAllUserAddrsSuccess,
		(state, { userAddrs }): UserAddrsState => ({
			...state,
			userAddrs: userAddrs,
			status: 'success',
		}),
	),

	on(
		UserAddrsAction.getAllUserAddrsFailure,
		(state, { error }): UserAddrsState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
