import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as BooksAction from '../../stores/books/books.actions';
import { Book } from '../../shared/interfaces/book.model';
import { selectAllBooks } from '../../stores/books/books.selectors';

@Component({
	selector: 'app-search',
	standalone: true,
	imports: [SearchBarComponent],
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
	limit: number = 40;
	page: number = 1;

	books: Book[] | null = null;

	private destroy$ = new Subject<void>();

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.store.dispatch(
			BooksAction.searchBooks({ limit: this.limit, page: this.page }),
		);

		this.store
			.select(selectAllBooks)
			.pipe(takeUntil(this.destroy$))
			.subscribe((books) => {
				this.books = books;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
