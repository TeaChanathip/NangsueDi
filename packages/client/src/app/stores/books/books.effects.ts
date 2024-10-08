import { BookService } from '../../apis/book/book.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BooksActions from './books.actions';
import * as BorrowsActions from '../borrows/borrows.actions';
import * as AlertsActions from '../alerts/alerts.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Book } from '../../shared/interfaces/book.model';

@Injectable()
export class BooksEffect {
	constructor(
		private actions$: Actions,
		private bookService: BookService,
	) {}

	searchBooks$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BooksActions.searchBooks),
			mergeMap((action) =>
				this.bookService.search(action).pipe(
					map((res: HttpResponse<Book[]>) => {
						return BooksActions.searchBooksSuccess({
							books: res.body as Book[],
						});
					}),
					catchError((error) => {
						return of(BooksActions.searchBooksFailure(error));
					}),
				),
			),
		);
	});

	searchMoreBooks$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BooksActions.searchMoreBooks),
			mergeMap((action) =>
				this.bookService.search(action).pipe(
					map((res: HttpResponse<Book[]>) => {
						const books = res.body as Book[];
						if (books.length < 1) {
							return BooksActions.searchNoMoreBooks();
						}
						return BooksActions.searchMoreBooksSuccess({
							books,
						});
					}),
					catchError((error) => {
						return of(BooksActions.searchMoreBooksFailure(error));
					}),
				),
			),
		);
	});

	register$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BooksActions.registerBook),
			mergeMap((action) => {
				const {
					title,
					author,
					description,
					publishedAt,
					total,
					genres,
					coverUrl,
				} = action;
				return this.bookService
					.register({
						title,
						...(author && { author }),
						...(description && { description }),
						...(publishedAt !== undefined && { publishedAt }),
						total,
						...(genres && { genres }),
						...(coverUrl && { coverUrl }),
					})
					.pipe(
						mergeMap((res: HttpResponse<Book>) =>
							of(
								BooksActions.registerBookSuccess({
									book: res.body as Book,
								}),
								AlertsActions.pushAlert({
									alert: {
										kind: 'success',
										header: 'registerd book',
									},
								}),
							),
						),
						catchError((error) =>
							of(
								BooksActions.registerBookFailure({ error }),
								AlertsActions.pushAlert({
									alert: {
										kind: 'fail',
										header: 'something went wrong',
										msg: 'Please try again later.',
									},
								}),
							),
						),
					);
			}),
		);
	});

	getBook$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BooksActions.getBook),
			mergeMap((action) =>
				this.bookService.getBook(action.bookId).pipe(
					mergeMap((res: HttpResponse<Book>) =>
						of(
							BooksActions.getBookSuccess({
								book: res.body as Book,
							}),
							AlertsActions.pushAlert({
								alert: {
									kind: 'success',
									header: 'get book info',
								},
							}),
						),
					),
					catchError((error) =>
						of(
							BooksActions.getBookFailure({ error }),
							AlertsActions.pushAlert({
								alert: {
									kind: 'fail',
									header: 'cannot get book info',
									msg: 'Please try again later.',
								},
							}),
						),
					),
				),
			),
		);
	});

	getBookAndNonRetBrrws$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(BooksActions.getBookAndNonRetBrrws),
			mergeMap((action) =>
				of(
					BooksActions.getBook({ bookId: action.bookId }),
					BorrowsActions.getNonRetBrrws({}),
				),
			),
		);
	});
}
