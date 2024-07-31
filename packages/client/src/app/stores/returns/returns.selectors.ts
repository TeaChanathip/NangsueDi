import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReturnState } from './returns.reducer';

export const returnsKey = 'returns';

export const selectReturns = createFeatureSelector<ReturnState>(returnsKey);

export const selectAllReturns = createSelector(
	selectReturns,
	(state) => state.returns,
);
