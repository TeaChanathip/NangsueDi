import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BorrowsState } from './borrows.reducer';

export const borrowsKey = 'borrows';

export const selectAllBorrows = createFeatureSelector<BorrowsState>(borrowsKey);

export const selectNonRetBrrws = createSelector(
	selectAllBorrows,
	(state) => state.nonRetBrrws,
);
