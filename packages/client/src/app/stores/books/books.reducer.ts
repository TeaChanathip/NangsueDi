import { createReducer, on } from '@ngrx/store';
import { Book } from '../../shared/interfaces/book.model';
import * as BooksActions from './books.actions';

export type BookStatus =
	| 'pending'
	| 'loading'
	| 'error'
	| 'success'
	| 'no_more'
	| 'reg_waiting'
	| 'reg_success'
	| 'reg_error';

export interface BooksState {
	books: Book[] | null;
	error: string | null;
	status: BookStatus;
}

export const initialState: BooksState = {
	books: null,
	error: null,
	status: 'pending',
};

export const booksReducer = createReducer(
	initialState,

	on(
		BooksActions.searchBooks,
		(state): BooksState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		BooksActions.searchBooksSuccess,
		(state, { books }): BooksState => ({
			...state,
			books,
			error: null,
			status: 'success',
		}),
	),

	on(
		BooksActions.searchBooksFailure,
		(state, { error }): BooksState => ({
			...state,
			error,
			status: 'error',
		}),
	),

	on(
		BooksActions.searchMoreBooks,
		(state): BooksState => ({
			...state,
			error: null,
			status: 'loading',
		}),
	),

	on(
		BooksActions.searchMoreBooksSuccess,
		(state, { books }): BooksState => ({
			...state,
			books: state.books!.concat(books),
			error: null,
			status: 'success',
		}),
	),

	on(
		BooksActions.searchNoMoreBooks,
		(state): BooksState => ({
			...state,
			status: 'no_more',
		}),
	),

	// register book
	on(
		BooksActions.registerBook,
		(state): BooksState => ({
			...state,
			error: null,
			status: 'reg_waiting',
		}),
	),
	on(
		BooksActions.registerBookSuccess,
		(state, { book }): BooksState => ({
			...state,
			books: state.books!.concat(book),
			status: 'reg_success',
		}),
	),
	on(
		BooksActions.registerBookFailure,
		(state, { error }): BooksState => ({
			...state,
			error,
			status: 'reg_error',
		}),
	),
);
