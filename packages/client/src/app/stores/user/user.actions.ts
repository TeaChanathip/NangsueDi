import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';

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
// export const removeUser = createAction('');
