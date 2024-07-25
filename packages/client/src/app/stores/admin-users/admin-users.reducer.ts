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
);
