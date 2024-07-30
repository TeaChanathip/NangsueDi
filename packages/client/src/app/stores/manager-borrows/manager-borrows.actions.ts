import { createAction, props } from '@ngrx/store';
import { Borrow } from '../../shared/interfaces/borrow.model';

export const getUserBrrwsReqs = createAction(
	'[Requests Page] Get User Borrows Request',
	props<{
		bookKeyword?: string;
		isApproved?: number;
		isReturned?: number;
		limit?: number;
		page?: number;
	}>(),
);
export const getUserBrrwsReqsSuccess = createAction(
	'[Manager API] Get User Borrows Request Success',
	props<{ borrows: Borrow[] }>(),
);
export const getUserBrrwsReqsFailure = createAction(
	'[Manager API] Get User Borrows Request Failure',
	props<{ error: string }>(),
);
