import { createReducer, on } from '@ngrx/store';
import { Borrow } from '../../shared/interfaces/borrow.model';
import * as MgrBrrwsActions from './manager-borrows.actions';

export type MgrBrrwsStatus = 'idel' | 'pending' | 'success' | 'error';

export interface MgrBrrwsState {
	borrows: Borrow[] | null;
	error: string | null;
	status: MgrBrrwsStatus;
}

export const initialState: MgrBrrwsState = {
	borrows: null,
	error: null,
	status: 'idel',
};

export const mgrBrrwsReducer = createReducer(
	initialState,

	on(
		MgrBrrwsActions.getUserBrrwsReqs,
		(state): MgrBrrwsState => ({
			...state,
			error: null,
			status: 'pending',
		}),
	),
	on(
		MgrBrrwsActions.getUserBrrwsReqsSuccess,
		(state, { borrows }): MgrBrrwsState => ({
			...state,
			borrows,
			status: 'success',
		}),
	),
	on(
		MgrBrrwsActions.getUserBrrwsReqsFailure,
		(state, { error }): MgrBrrwsState => ({
			...state,
			error,
			status: 'error',
		}),
	),
);
