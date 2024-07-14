import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const userKey = 'user';

// selectFeature will have the type MemoizedSelector<object, UserState>
export const selectUser = createFeatureSelector<UserState>(userKey);

// selectCurrUser will have the type MemoizedSelector<object, User>
export const selectCurrUser = createSelector(selectUser, (state) => state.user);
export const selectUserStatus = createSelector(
	selectUser,
	(state) => state.status,
);
