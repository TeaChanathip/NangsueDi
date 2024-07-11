import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';
import * as UserActions from './user.actions';
import { HttpStatusCode } from '@angular/common/http';

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

	//
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
);
