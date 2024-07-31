import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MgrRetsState } from './manager-returns.reducer';

export const mgrRetsKey = 'mgrRets';

export const selectMgrRets = createFeatureSelector<MgrRetsState>(mgrRetsKey);

export const selectAllMgrRets = createSelector(
	selectMgrRets,
	(state) => state.returns,
);
