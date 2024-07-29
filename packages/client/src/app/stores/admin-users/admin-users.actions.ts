import { createAction, props } from '@ngrx/store';
import { Role } from '../../shared/enums/role.enum';
import { User } from '../../shared/interfaces/user.model';

export const searchUsers = createAction(
	'[Manage Users Page] Search User',
	props<{
		email?: string;
		phone?: string;
		firstName?: string;
		lastName?: string;
		roles?: Role[];
		isVerified?: number;
		isSuspended?: number;
		limit: number;
		page: number;
	}>(),
);

export const searchUsersSuccess = createAction(
	'[Admin API] Search User Success',
	props<{ users: User[] }>(),
);

export const searchUsersFailure = createAction(
	'[Admin API] Search User Failure',
	props<{ error: string }>(),
);

// Verify
export const verifyUser = createAction(
	'[Manage Users Page] Verify User',
	props<{ userId: string }>(),
);

export const verifyUserSuccess = createAction(
	'[Admin API] Verify User Success',
	props<{ user: User }>(),
);

export const verifyUserFailure = createAction(
	'[Admin API] Verify User Failure',
	props<{ error: string }>(),
);

// Delete
export const deleteUser = createAction(
	'[Manage Users Page] Delete User',
	props<{ userId: string }>(),
);

export const deleteUserSuccess = createAction(
	'[Admin API] Delete User Success',
	props<{ user: User }>(),
);

export const deleteUserFailure = createAction(
	'[Admin API] Delete User Failure',
	props<{ error: string }>(),
);

// Suspend
export const suspendUser = createAction(
	'[Manage Users Page] Suspend User',
	props<{ userId: string }>(),
);

export const suspendUserSuccess = createAction(
	'[Admin API] Suspend User Success',
	props<{ user: User }>(),
);

export const suspendUserFailure = createAction(
	'[Admin API] Suspend User Failure',
	props<{ error: string }>(),
);

// Unsuspend
export const unsuspendUser = createAction(
	'[Manage Users Page] Unsuspend User',
	props<{ userId: string }>(),
);

export const unsuspendUserSuccess = createAction(
	'[Admin API] Unsuspend User Success',
	props<{ user: User }>(),
);

export const unsuspendUserFailure = createAction(
	'[Admin API] Unsuspend User Failure',
	props<{ error: string }>(),
);
