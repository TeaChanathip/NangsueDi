import { BookService } from '../../apis/book/book.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BooksActions from './books.actions';
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
}
