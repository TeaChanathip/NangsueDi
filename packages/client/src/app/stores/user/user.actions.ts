import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';

// Login
export const login = createAction(
	'[Login Page] Login',
	props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
	'[Auth Login API] Login Success',
	props<{ user: User }>(),
);

export const loginFailure = createAction(
	'[Auth Login API] Login Failure',
	props<{ error: string }>(),
);

export const loginUnauthorized = createAction(
	'[Auth Login API] Login Unauthorized',
);

export const logout = createAction('[Navbar Component] Logout');

// Get User API
export const getUser = createAction('[User API] Get User');

export const getUserSuccess = createAction(
	'[User API] Get User Success',
	props<{ user: User }>(),
);

export const getUserFailure = createAction(
	'[User API] Get User Failure',
	props<{ error: string }>(),
);

// Update User API
export const updateProfile = createAction(
	'[Profile Page] Update Profile',
	props<{
		firstName?: string;
		lastName?: string;
		phone?: string;
		birthTime?: number;
	}>(),
);

export const updateProfileSuccess = createAction(
	'[User API] Update Profile Success',
	props<{ user: User }>(),
);

export const updateProfileFailure = createAction(
	'[User API] Update Profile Failure',
	props<{ error: string }>(),
);
