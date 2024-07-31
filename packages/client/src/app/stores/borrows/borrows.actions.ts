import { createAction, props } from '@ngrx/store';
import { Borrow } from '../../shared/interfaces/borrow.model';

export const getNonRetBrrws = createAction(
	'[Borrow API] Get Non-Returned Borrows',
	props<{ limit?: number; page?: number }>(),
);
export const getNonRetBrrwsSuccess = createAction(
	'[Borrow API] Get Non-Returned Borrows Success',
	props<{ borrows: Borrow[] }>(),
);
export const getNonRetBrrwsFailure = createAction(
	'[Borrow API] Get Non-Returned Borrows Failure',
	props<{ error: string }>(),
);

export const borrowBook = createAction(
	'[Book Page] Borrow Book',
	props<{ bookId: string; addrId: string }>(),
);
export const borrowBookSuccess = createAction(
	'[Book Page] Borrow Book Success',
	props<{ borrow: Borrow }>(),
);
export const borrowBookFailure = createAction(
	'[Book Page] Borrow Book Failure',
	props<{ error: string }>(),
);

// Get Borrws by Query params
export const getBrrws = createAction(
	'[My-Shelf Page] Get Borrows',
	props<{
		bookKeyword?: string;
		isApproved?: number;
		isRejected?: number;
		isReturned?: number;
		limit?: number;
		page?: number;
	}>(),
);
export const getBrrwsSuccess = createAction(
	'[Borrow API] Get Borrows Success',
	props<{ borrows: Borrow[] }>(),
);
export const getBrrwsFailure = createAction(
	'[Borrow API] Get Borrows Failure',
	props<{ error: string }>(),
);

export const getBrrwsAndReturn = createAction(
	'[My-Shelf Page] Get Borrows and Returns',
	props<{
		bProps: {
			bookKeyword?: string;
			isApproved?: number;
			isReturned?: number;
			limit?: number;
			page?: number;
		};
		rProps: {
			bookKeyword?: string;
			borrowId?: string;
			isApproved?: number;
			isRejected?: number;
			limit?: number;
			page?: number;
		};
	}>(),
);

export const cancelBorrow = createAction(
	'[My-Shelf Page] Cancel Borrow',
	props<{ borrowId: string }>(),
);
export const cancelBorrowSuccess = createAction(
	'[My-Shelf Page] Cancel Borrow Success',
	props<{ borrow: Borrow }>(),
);
export const cancelBorrowFailure = createAction(
	'[My-Shelf Page] Cancel Borrow Failure',
	props<{ error: string }>(),
);
