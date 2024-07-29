import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';
import * as AdminUsersActions from './admin-users.actions';

export type AdminUsersStatus = 'pending' | 'loading' | 'error' | 'success';

export interface AdminUsersState {
	users: User[] | null;
	error: string | null;
	status: AdminUsersStatus;
}

export const initialState: AdminUsersState = {
	users: null,
	error: null,
	status: 'pending',
};

export const adminUsersReducer = createReducer(
	initialState,

	// Search
	on(
		AdminUsersActions.searchUsers,
		(state): AdminUsersState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),
	on(
		AdminUsersActions.searchUsersSuccess,
		(state, { users }): AdminUsersState => ({
			...state,
			users,
			status: 'success',
		}),
	),
	on(
		AdminUsersActions.searchUsersFailure,
		(state, { error }): AdminUsersState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Verify
	on(
		AdminUsersActions.verifyUser,
		(state): AdminUsersState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),
	on(
		AdminUsersActions.verifyUserSuccess,
		(state, { user }): AdminUsersState => ({
			...state,
			users: state.users!.map((u) => {
				if (u._id === user._id) {
					return user;
				}

				return u;
			}),
			status: 'success',
		}),
	),
	on(
		AdminUsersActions.verifyUserFailure,
		(state, { error }): AdminUsersState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Delete
	on(
		AdminUsersActions.deleteUser,
		(state): AdminUsersState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),
	on(
		AdminUsersActions.deleteUserSuccess,
		(state, { user }): AdminUsersState => ({
			...state,
			users: state.users!.filter((u) => u._id !== user._id),
			status: 'success',
		}),
	),
	on(
		AdminUsersActions.deleteUserFailure,
		(state, { error }): AdminUsersState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Suspend
	on(
		AdminUsersActions.suspendUser,
		(state): AdminUsersState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),
	on(
		AdminUsersActions.suspendUserSuccess,
		(state, { user }): AdminUsersState => ({
			...state,
			users: state.users!.map((u) => {
				if (u._id === user._id) {
					return user;
				}

				return u;
			}),
			status: 'success',
		}),
	),
	on(
		AdminUsersActions.suspendUserFailure,
		(state, { error }): AdminUsersState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Unsuspend
	on(
		AdminUsersActions.unsuspendUser,
		(state): AdminUsersState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),
	on(
		AdminUsersActions.unsuspendUserSuccess,
		(state, { user }): AdminUsersState => ({
			...state,
			users: state.users!.map((u) => {
				if (u._id === user._id) {
					return user;
				}

				return u;
			}),
			status: 'success',
		}),
	),
	on(
		AdminUsersActions.unsuspendUserFailure,
		(state, { error }): AdminUsersState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
