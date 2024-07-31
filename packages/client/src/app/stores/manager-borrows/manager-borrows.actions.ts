import { createAction, props } from '@ngrx/store';
import { Borrow } from '../../shared/interfaces/borrow.model';

// Get All Brrows Requests
export const getUserBrrwsReqs = createAction(
	'[Requests Page] Get User Borrows Request',
	props<{
		bookKeyword?: string;
		isApproved?: number;
		isRejected?: number;
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

// Approve Borrow Request
export const approveBrrw = createAction(
	'[Requests Page] Approve User Borrow Request',
	props<{ borrowId: string }>(),
);
export const approveBrrwSuccess = createAction(
	'[Manager API] Approve User Borrow Request Success',
	props<{ borrow: Borrow }>(),
);
export const approveBrrwFailure = createAction(
	'[Manager API] Approve User Borrow Request Failure',
	props<{ error: string }>(),
);

// Reject Borrow Request
export const rejectBrrw = createAction(
	'[Requests Page] Reject User Borrow Request',
	props<{ borrowId: string; rejectReason: string }>(),
);
export const rejectBrrwSuccess = createAction(
	'[Manager API] Reject User Borrow Request Success',
	props<{ borrow: Borrow }>(),
);
export const rejectBrrwFailure = createAction(
	'[Manager API] Reject User Borrow Request Failure',
	props<{ error: string }>(),
);
