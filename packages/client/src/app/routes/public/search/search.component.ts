import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as BooksAction from '../../../stores/books/books.actions';
import { Book } from '../../../shared/interfaces/book.model';
import { ActivatedRoute } from '@angular/router';
import { ScrollNearEndDirective } from '../../../shared/directives/scroll-near-end.directive';
import { selectBooks } from '../../../stores/books/books.selectors';

@Component({
	selector: 'app-search',
	standalone: true,
	imports: [SearchBarComponent, ScrollNearEndDirective],
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
	// for store the query param from url
	props: {
		bookKeyword?: string;
		publishedBegin?: number;
		publishedEnd?: number;
		isAvailable?: boolean;
		genres?: number[];
		limit: number;
		page: number;
	} = {
		limit: 24,
		page: 1,
	};

	// for contain the books from ngrx selector
	books: Book[] | null = null;
	booksStatus: 'pending' | 'loading' | 'error' | 'success' | 'no_more' =
		'pending';

	// for debouncing
	timer: ReturnType<typeof setTimeout> | undefined = undefined;

	private destroy$ = new Subject<void>();

	constructor(
		private store: Store,
		private route: ActivatedRoute,
	) {}

	searchMoreBook() {
		this.props.page++;
		this.store.dispatch(BooksAction.searchMoreBooks(this.props));
	}

	debSeachMoreBook() {
		// skip if there are no more book in the db
		if (this.booksStatus === 'no_more') return;

		clearTimeout(this.timer);
		this.timer = setTimeout(() => this.searchMoreBook(), 1000);
	}

	ngOnInit(): void {
		this.route.queryParams
			.pipe(takeUntil(this.destroy$))
			.subscribe((params) => {
				this.props = {
					limit: 24,
					page: 1,
				};

				if (params['bookKeyword']) {
					this.props['bookKeyword'] = params['bookKeyword'];
				}

				if (params['publishedBegin']) {
					this.props['publishedBegin'] = params['publishedBegin'];
				}

				if (params['publishedEnd']) {
					this.props['publishedEnd'] = params['publishedEnd'];
				}

				if (params['isAvailable']) {
					this.props['isAvailable'] = params['isAvailable'];
				}

				if (params['genres']) {
					this.props['genres'] = params['genres'];
				}

				this.store.dispatch(BooksAction.searchBooks(this.props));
			});

		this.store
			.select(selectBooks)
			.pipe(takeUntil(this.destroy$))
			.subscribe((state) => {
				this.books = state.books;
				this.booksStatus = state.status;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
