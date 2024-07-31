import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';
import * as UserActions from './user.actions';

export type UserStatus =
	| 'logged_in'
	| 'logged_out'
	| 'loading'
	| 'logged_in_error'
	| 'unauthorized'
	| 'updated'
	| 'updated_error';

export interface UserState {
	user: User | null;
	error: string | null;
	status: UserStatus;
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
			status: 'logged_in_error',
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
			user,
			error: null,
			status: 'logged_in',
		}),
	),

	on(
		UserActions.getUserFailure,
		(state, { error }): UserState => ({
			...state,
			error,
			status: 'logged_out',
		}),
	),

	on(
		UserActions.updateProfile,
		(state): UserState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		UserActions.updateProfileSuccess,
		(state, { user }): UserState => ({
			...state,
			user,
			error: null,
			status: 'updated',
		}),
	),

	on(
		UserActions.updateProfileFailure,
		(state, { error }): UserState => ({
			...state,
			error: error,
			status: 'updated_error',
		}),
	),

	on(
		UserActions.deleteProfileSuccess,
		(state): UserState => ({
			...state,
			user: null,
			status: 'logged_out',
		}),
	),
);
