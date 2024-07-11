import { State, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState) => state.user;
export const selectAllUser = createSelector(
	selectUser,
	(state: UserState) => state.user,
);

export const selectUserStatus = (state: AppState) => state.user;
export const selectAllUserStatus = createSelector(
	selectUserStatus,
	(state: UserState) => state.status,
);
