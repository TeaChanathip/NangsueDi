import { createAction, props } from '@ngrx/store';
import { Book } from '../../shared/interfaces/book.model';

export const searchBooks = createAction(
	'[Search Page] Search Books',
	props<{
		publishedBegin?: number;
		publishedEnd?: number;
		isAvailable?: boolean;
		genres?: number[];
		limit?: number;
		page?: number;
	}>(),
);

export const searchBooksSuccess = createAction(
	'[Search API] Search Books Success',
	props<{ books: Book[] }>(),
);

export const searchBooksFailure = createAction(
	'[Search API] Search Books Failure',
	props<{ error: string }>(),
);
