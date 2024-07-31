import { createReducer, on } from '@ngrx/store';
import { Return } from '../../shared/interfaces/return.model';
import * as ReturnsActions from './returns.actions';

export type ReturnStatus = 'idel' | 'pending' | 'success' | 'error';

export interface ReturnState {
	returns: Return[] | null;
	error: string | null;
	status: ReturnStatus;
}

export const initialState: ReturnState = {
	returns: null,
	error: null,
	status: 'idel',
};

export const returnsReducer = createReducer(
	initialState,

	// Return a Book
	on(
		ReturnsActions.returnBook,
		(state): ReturnState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		ReturnsActions.returnBookSuccess,
		(state, { returnObj }): ReturnState => ({
			...state,
			returns: state.returns?.concat(returnObj) ?? [returnObj],
			status: 'success',
		}),
	),
	on(
		ReturnsActions.returnBookFailure,
		(state, { error }): ReturnState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	on(
		ReturnsActions.getReturns,
		(state): ReturnState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		ReturnsActions.getReturnsSuccess,
		(state, { returns }): ReturnState => ({
			...state,
			returns,
			status: 'success',
		}),
	),
	on(
		ReturnsActions.getReturnsFailure,
		(state, { error }): ReturnState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
