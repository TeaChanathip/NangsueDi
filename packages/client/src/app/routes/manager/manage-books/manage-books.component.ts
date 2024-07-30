import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScrollNearEndDirective } from '../../../shared/directives/scroll-near-end.directive';
import { BooksSearchBarComponent } from '../../../shared/components/books-search-bar/books-search-bar.component';
import { Book } from '../../../shared/interfaces/book.model';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as BooksAction from '../../../stores/books/books.actions';
import {
	selectBooks,
	selectBookStatus,
} from '../../../stores/books/books.selectors';
import { RegisterBookModalComponent } from '../components/register-book-modal/register-book-modal.component';
import { BookStatus } from '../../../stores/books/books.reducer';

@Component({
	selector: 'app-manage-books',
	standalone: true,
	imports: [
		BooksSearchBarComponent,
		ScrollNearEndDirective,
		RegisterBookModalComponent,
	],
	templateUrl: './manage-books.component.html',
	styleUrl: './manage-books.component.scss',
})
export class ManageBooksComponent implements OnInit, OnDestroy {
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
	booksStatus: BookStatus = 'pending';

	// for debouncing
	timer: ReturnType<typeof setTimeout> | undefined = undefined;

	// for register book
	isRegModalOpen: boolean = false;

	private destroy$ = new Subject<void>();

	constructor(
		private store: Store,
		private route: ActivatedRoute,
		private router: Router,
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

	toggleRegModal() {
		this.isRegModalOpen = !this.isRegModalOpen;
	}

	navigateToBook(bookId: string) {
		this.router.navigate([`book/${bookId}`]);
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

		this.store
			.select(selectBookStatus)
			.pipe(takeUntil(this.destroy$))
			.subscribe((status) => {
				if (status === 'reg_success') {
					this.isRegModalOpen = false;
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
