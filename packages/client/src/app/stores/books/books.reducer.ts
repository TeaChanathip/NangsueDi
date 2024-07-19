import { createReducer, on } from '@ngrx/store';
import { Book } from '../../shared/interfaces/book.model';
import * as BooksActions from './books.actions';

export interface BooksState {
	books: Book[] | null;
	error: string | null;
	status: 'pending' | 'loading' | 'error' | 'success' | 'no_more';
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
);
