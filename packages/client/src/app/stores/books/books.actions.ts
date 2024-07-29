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

export const searchMoreBooks = createAction(
	'[Search Page] Search More Books',
	props<{
		publishedBegin?: number;
		publishedEnd?: number;
		isAvailable?: boolean;
		genres?: number[];
		limit?: number;
		page?: number;
	}>(),
);

export const searchMoreBooksSuccess = createAction(
	'[Search API] Search More Books Success',
	props<{ books: Book[] }>(),
);

export const searchMoreBooksFailure = createAction(
	'[Search API] Search More Books Failure',
	props<{ error: string }>(),
);

export const searchNoMoreBooks = createAction('[Search API] Search No More');

export const registerBook = createAction(
	'[Manage Books Page] Register Book',
	props<{
		title: string;
		author?: string;
		description?: string;
		publishedAt?: number;
		total: number;
		genres?: number[];
		coverUrl?: string;
	}>(),
);

export const registerBookSuccess = createAction(
	'[Manage Books Page] Register Book Success',
	props<{ book: Book }>(),
);

export const registerBookFailure = createAction(
	'[Manage Books Page] Register Book Failure',
	props<{ error: string }>(),
);
