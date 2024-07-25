import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminUsersState } from './admin-users.reducer';

export const adminUsersKey = 'adminUsers';

export const selectAdminUsers =
	createFeatureSelector<AdminUsersState>(adminUsersKey);

export const selectAllAdminUsers = createSelector(
	selectAdminUsers,
	(state) => state.users,
);
