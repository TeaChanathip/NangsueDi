import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';
import * as UserActions from './user.actions';

export interface UserState {
	user: User | null;
	error: string | null;
	status: 'logged_in' | 'logged_out' | 'loading' | 'error' | 'unauthorized';
}

export const initialState: UserState = {
	user: null,
	error: null,
	status: 'logged_out',
};

export const userReducer = createReducer(
	initialState,

	on(
		UserActions.login,
		(state): UserState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserActions.loginSuccess,
		(state, { user }): UserState => ({
			...state,
			user,
			error: null,
			status: 'logged_in',
		}),
	),

	on(
		UserActions.loginFailure,
		(state, { error }): UserState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	on(
		UserActions.loginUnauthorized,
		(state): UserState => ({
			...state,
			status: 'unauthorized',
		}),
	),

	on(
		UserActions.logout,
		(state): UserState => ({
			...state,
			user: null,
			error: null,
			status: 'logged_out',
		}),
	),

	on(
		UserActions.getUser,
		(state): UserState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserActions.getUserSuccess,
		(state, { user }): UserState => ({
			...state,
			user: user,
			error: null,
			status: 'logged_in',
		}),
	),

	on(
		UserActions.getUserFailure,
		(state, { error }): UserState => ({
			...state,
			error: error,
			status: 'logged_out',
		}),
	),
);
