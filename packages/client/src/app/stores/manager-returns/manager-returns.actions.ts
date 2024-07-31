import { createAction, props } from '@ngrx/store';
import { Return } from '../../shared/interfaces/return.model';

export const getUserReturns = createAction(
	'[Requests Page] Get User Returns Requests',
	props<{
		bookKeyword?: string;
		borrowIdQuery?: string;
		isApproved?: number;
		isRejected?: number;
		limit?: number;
		page?: number;
	}>(),
);
export const getUserReturnsSuccess = createAction(
	'[Manager API] Get User Returns Requests Success',
	props<{ returns: Return[] }>(),
);
export const getUserReturnsFailure = createAction(
	'[Manager API] Get User Returns Requests Failure',
	props<{ error: string }>(),
);

// Approve
export const approveReturns = createAction(
	'[Requests Page] Approve Returns',
	props<{ returnId: string }>(),
);
export const approveReturnsSuccess = createAction(
	'[Manager API] Approve Returns Success',
	props<{ returnObj: Return }>(),
);
export const approveReturnsFailure = createAction(
	'[Manager API] Approve Returns Failure',
	props<{ error: string }>(),
);

// Reject
export const rejectReturns = createAction(
	'[Requests Page] Reject Returns',
	props<{ returnId: string }>(),
);
export const rejectReturnsSuccess = createAction(
	'[Manager API] Reject Returns Success',
	props<{ returnObj: Return }>(),
);
export const rejectReturnsFailure = createAction(
	'[Manager API] Reject Returns Failure',
	props<{ error: string }>(),
);
