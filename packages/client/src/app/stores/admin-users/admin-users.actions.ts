import { createAction, props } from '@ngrx/store';
import { Role } from '../../shared/enums/role.enum';
import { User } from '../../shared/interfaces/user.model';

export const searchUsers = createAction(
	'[Search Users Page] Search User',
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
