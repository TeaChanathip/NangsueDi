import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksState } from './books.reducer';

export const booksKey = 'books';

// selectFeature will have the type MemoizedSelector<object, BooksState>
export const selectBooks = createFeatureSelector<BooksState>(booksKey);

export const selectAllBooks = createSelector(
	selectBooks,
	(state) => state.books,
);
