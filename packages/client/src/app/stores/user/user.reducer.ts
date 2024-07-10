import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';
import * as UserActions from './user.action';

export interface UserState {
	user: User | null;
	error: string | null;
	status: 'logged_in' | 'logged_out' | 'loading' | 'error';
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
			status: 'loading',
		}),
	),

	on(
		UserActions.loginSuccess,
		(state): UserState => ({
			...state,
			status: 'logged_in',
		}),
	),
);
