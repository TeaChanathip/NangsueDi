import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserAddrsState } from './user-addresses.reducer';

export const userAddrsKey = 'userAddrs';

export const selectUserAddrs =
	createFeatureSelector<UserAddrsState>(userAddrsKey);

export const selectAllUserAddrs = createSelector(
	selectUserAddrs,
	(state) => state.userAddrs,
);
export const selectUserAddrsStatus = createSelector(
	selectUserAddrs,
	(state) => state.status,
);
