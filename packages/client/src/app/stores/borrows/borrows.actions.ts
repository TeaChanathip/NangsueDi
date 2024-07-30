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
