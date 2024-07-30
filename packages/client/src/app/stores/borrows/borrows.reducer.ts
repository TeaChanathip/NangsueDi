import { createReducer, on } from '@ngrx/store';
import { Borrow } from '../../shared/interfaces/borrow.model';
import * as BorrowsActions from './borrows.actions';

export type BorrowStatus =
	| 'idel'
	| 'pending'
	| 'success'
	| 'error'
	| 'nonRet_pending'
	| 'nonRet_success'
	| 'nonRet_error';

export interface BorrowsState {
	borrows: Borrow[] | null;
	nonRetBrrws: Borrow[] | null;
	error: string | null;
	status: BorrowStatus;
}

const initialState: BorrowsState = {
	borrows: null,
	nonRetBrrws: null,
	error: null,
	status: 'idel',
};

export const borrowsReducer = createReducer(
	initialState,

	// Get Non-Returned Borrows
	on(
		BorrowsActions.getNonRetBrrws,
		(state): BorrowsState => ({
			...state,
			error: null,
			status: 'nonRet_pending',
		}),
	),
	on(
		BorrowsActions.getNonRetBrrwsSuccess,
		(state, { borrows }): BorrowsState => ({
			...state,
			nonRetBrrws: borrows,
			status: 'nonRet_success',
		}),
	),
	on(
		BorrowsActions.getNonRetBrrwsFailure,
		(state, { error }): BorrowsState => ({
			...state,
			error,
			status: 'nonRet_error',
		}),
	),

	// Borrows a Book
	on(
		BorrowsActions.borrowBook,
		(state): BorrowsState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		BorrowsActions.borrowBookSuccess,
		(state, { borrow }): BorrowsState => ({
			...state,
			borrows:
				state.borrows?.map((b) => {
					if (b.book._id !== borrow.book._id) {
						return b;
					}

					return borrow;
				}) ?? null,
			nonRetBrrws: state.nonRetBrrws!.concat(borrow),
			status: 'success',
		}),
	),
	on(
		BorrowsActions.borrowBookFailure,
		(state): BorrowsState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
);
