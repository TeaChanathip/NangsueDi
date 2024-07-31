import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BorrowsState } from './borrows.reducer';

export const borrowsKey = 'borrows';

export const selectBorrows = createFeatureSelector<BorrowsState>(borrowsKey);

export const selectAllBorrows = createSelector(
	selectBorrows,
	(state) => state.borrows,
);
export const selectNonRetBrrws = createSelector(
	selectBorrows,
	(state) => state.nonRetBrrws,
);
