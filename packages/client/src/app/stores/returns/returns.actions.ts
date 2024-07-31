import { createAction, props } from '@ngrx/store';
import { Return } from '../../shared/interfaces/return.model';

export const returnBook = createAction(
	'[My-Shelf Page] Borrow Book',
	props<{ borrowId: string }>(),
);
export const returnBookSuccess = createAction(
	'[Return API] Return Book Success',
	props<{ returnObj: Return }>(),
);
export const returnBookFailure = createAction(
	'[Return API] Return Book Failure',
	props<{ error: string }>(),
);

export const getReturns = createAction(
	'[My-Shefl Page] Get Returns',
	props<{
		bookKeyword?: string;
		borrowId?: string;
		isApproved?: number;
		isRejected?: number;
		limit?: number;
		page?: number;
	}>(),
);
export const getReturnsSuccess = createAction(
	'[Return API] Get Returns Success',
	props<{ returns: Return[] }>(),
);
export const getReturnsFailure = createAction(
	'[Return API] Get Returns Failure',
	props<{ error: string }>(),
);
