import { createReducer, on } from '@ngrx/store';
import { Return } from '../../shared/interfaces/return.model';
import * as MgrRetsActions from './manager-returns.actions';

export type MgrRetsStatus = 'idel' | 'pending' | 'success' | 'error';

export interface MgrRetsState {
	returns: Return[] | null;
	error: string | null;
	status: MgrRetsStatus;
}

export const initialState: MgrRetsState = {
	returns: null,
	error: null,
	status: 'idel',
};

export const mgrRetsReducer = createReducer(
	initialState,

	// Get
	on(
		MgrRetsActions.getUserReturns,
		(state): MgrRetsState => ({ ...state, error: null, status: 'pending' }),
	),
	on(
		MgrRetsActions.getUserReturnsSuccess,
		(state, { returns }): MgrRetsState => ({
			...state,
			returns,
			status: 'success',
		}),
	),
	on(
		MgrRetsActions.getUserReturnsFailure,
		(state, { error }): MgrRetsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Approve
	on(
		MgrRetsActions.approveReturns,
		(state): MgrRetsState => ({ ...state, error: null, status: 'pending' }),
	),
	on(
		MgrRetsActions.approveReturnsSuccess,
		(state, { returnObj }): MgrRetsState => ({
			...state,
			returns:
				state.returns?.filter((ret) => ret._id !== returnObj._id) ??
				null,
			status: 'success',
		}),
	),
	on(
		MgrRetsActions.approveReturnsFailure,
		(state, { error }): MgrRetsState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	// Reject
	on(
		MgrRetsActions.rejectReturns,
		(state): MgrRetsState => ({ ...state, error: null, status: 'pending' }),
	),
	on(
		MgrRetsActions.rejectReturnsSuccess,
		(state, { returnObj }): MgrRetsState => ({
			...state,
			returns:
				state.returns?.filter((ret) => ret._id !== returnObj._id) ??
				null,
			status: 'success',
		}),
	),
	on(
		MgrRetsActions.rejectReturnsFailure,
		(state, { error }): MgrRetsState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
