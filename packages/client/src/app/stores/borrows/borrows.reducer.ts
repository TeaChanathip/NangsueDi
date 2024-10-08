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
			status: 'error',
		}),
	),

	// Get Borrow by Query Params
	on(
		BorrowsActions.getBrrws,
		(state): BorrowsState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		BorrowsActions.getBrrwsSuccess,
		(state, { borrows }): BorrowsState => ({
			...state,
			borrows,
			status: 'success',
		}),
	),
	on(
		BorrowsActions.getBrrwsFailure,
		(state, { error }): BorrowsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	on(
		BorrowsActions.cancelBorrow,
		(state): BorrowsState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		BorrowsActions.cancelBorrowSuccess,
		(state, { borrow }): BorrowsState => ({
			...state,
			borrows: state.borrows?.filter((b) => b._id !== borrow._id) ?? null,
			nonRetBrrws:
				state.nonRetBrrws?.filter((b) => b._id !== borrow._id) ?? null,
			status: 'success',
		}),
	),
	on(
		BorrowsActions.cancelBorrowFailure,
		(state, { error }): BorrowsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Borrow was Return
	// on(
	// 	BorrowsActions.borrowWasReturn,
	// 	(state, { returnObj }): BorrowsState => ({
	// 		...state,
	// 		borrows:
	// 			state.borrows?.map((brrw) => {
	// 				if(brrw._id === returnObj.borrowId) {
	// 					return {
	// 						...brrw,
	// 						returnedAt: returnObj.
	// 					}
	// 				}
	// 			}) ?? null,
	// 	}),
	// ),
);
