import { createReducer, on } from '@ngrx/store';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import * as UserAddrsAction from './user-addresses.actions';

export interface UserAddrsState {
	userAddrs: UserAddr[] | null;
	error: string | null;
	status:
		| 'pending'
		| 'loading'
		| 'success'
		| 'error'
		| 'added'
		| 'updated'
		| 'deleted';
}

export const initialState: UserAddrsState = {
	userAddrs: null,
	error: null,
	status: 'pending',
};

export const userAddrsReducer = createReducer(
	initialState,

	// Get
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

	// Post
	on(
		UserAddrsAction.addNewUserAddr,
		(state): UserAddrsState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserAddrsAction.addNewUserAddrSuccess,
		(state, { userAddr }): UserAddrsState => ({
			...state,
			userAddrs: state!.userAddrs!.concat([userAddr]),
			status: 'added',
		}),
	),

	on(
		UserAddrsAction.addNewUserAddrFailure,
		(state, { error }): UserAddrsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Patch
	on(
		UserAddrsAction.updateUserAddr,
		(state): UserAddrsState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserAddrsAction.updateUserAddrSuccess,
		(state, { userAddr }): UserAddrsState => ({
			...state,
			userAddrs: state.userAddrs!.map((addr) => {
				if (addr._id === userAddr._id) {
					return userAddr;
				}
				return addr;
			}),
			status: 'updated',
		}),
	),

	on(
		UserAddrsAction.updateUserAddrFailure,
		(state, { error }): UserAddrsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Delete
	on(
		UserAddrsAction.deleteUserAddr,
		(state): UserAddrsState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserAddrsAction.deleteUserAddrSuccess,
		(state, { _id }): UserAddrsState => ({
			...state,
			userAddrs: state.userAddrs!.filter((addr) => addr._id !== _id),
			status: 'deleted',
		}),
	),

	on(
		UserAddrsAction.deleteUserAddrFailure,
		(state, { error }): UserAddrsState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
