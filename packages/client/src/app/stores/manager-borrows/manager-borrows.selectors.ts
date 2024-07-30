import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MgrBrrwsState } from './manager-borrows.reducer';

export const mgrBrrwsKey = 'mgrBrrws';

export const selectMgrBrrws = createFeatureSelector<MgrBrrwsState>(mgrBrrwsKey);

export const selectAllMgrBrrws = createSelector(
	selectMgrBrrws,
	(state) => state.borrows,
);
