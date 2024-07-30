import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../../apis/book/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, Subject, takeUntil } from 'rxjs';
import { Book } from '../../../shared/interfaces/book.model';
import { Store } from '@ngrx/store';
import * as AlertsActions from '../../../stores/alerts/alerts.actions';
import { AsyncPipe } from '@angular/common';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { unixToYMD } from '../../../shared/utils/unixToYMD';
import { FormInputBoxComponent } from '../../../shared/components/form-input-box/form-input-box.component';
import { genreOptions } from '../../../shared/constants/genre.constant';
import { FormTextComponent } from '../../../shared/components/form-text/form-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { selectCurrUser } from '../../../stores/user/user.selectors';
import { User } from '../../../shared/interfaces/user.model';
import { Borrow } from '../../../shared/interfaces/borrow.model';
import { selectNonRetBrrws } from '../../../stores/borrows/borrows.selectors';
import * as BorrowsActions from '../../../stores/borrows/borrows.actions';
import { BorrowModalComponent } from './components/borrow-modal/borrow-modal.component';
import { selectCurrBook } from '../../../stores/books/books.selectors';
import * as BooksActions from '../../../stores/books/books.actions';

@Component({
	selector: 'app-book',
	standalone: true,
	imports: [
		AsyncPipe,
		ReactiveFormsModule,
		FormInputComponent,
		FormInputBoxComponent,
		FormTextComponent,
		ButtonComponent,
		BorrowModalComponent,
	],
	templateUrl: './book.component.html',
	styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit, OnDestroy {
	bookId = this.activatedRoute.snapshot.params['bookId'];
	book$: Observable<Book | null>;
	user$: Observable<User | null>;
	nonRetBrrws$: Observable<Borrow[] | null>;

	genreOptions = genreOptions;

	updateBookForm = new FormGroup({
		title: new FormControl<string>('', { nonNullable: true }),
		author: new FormControl<string>('', { nonNullable: true }),
		description: new FormControl<string>('', { nonNullable: true }),
		publishedDate: new FormControl<string>('', { nonNullable: true }),
		total: new FormControl<number | undefined>(undefined, {
			nonNullable: true,
		}),
		genres: new FormControl<number[]>([], { nonNullable: true }),
		coverUrl: new FormControl<string>('', { nonNullable: true }),
	});

	initialValue: {
		title: string;
		author?: string;
		description?: string;
		publishedDate?: string;
		total: number;
		genres?: number[];
		coverUrl?: string;
	} = { title: '', total: 1 };

	isDisableBorrow: boolean = false;

	isBorrowModalOpen: boolean = false;

	destroy$ = new Subject<void>();

	constructor(
		private activatedRoute: ActivatedRoute,
		private bookService: BookService,
		private router: Router,
		private store: Store,
	) {
		this.book$ = this.store.select(selectCurrBook);

		this.user$ = this.store.select(selectCurrUser);

		this.nonRetBrrws$ = this.store.select(selectNonRetBrrws);
	}

	// for Admin and Manager
	deleteBook() {
		this.bookService
			.deleteBook(this.bookId)
			.pipe(
				map(() => {
					this.store.dispatch(
						AlertsActions.pushAlert({
							alert: {
								kind: 'success',
								header: 'delete book',
							},
						}),
					);

					this.router.navigate(['manage-books']);
				}),
				catchError(() => {
					this.store.dispatch(
						AlertsActions.pushAlert({
							alert: {
								kind: 'fail',
								header: 'someting went wrong',
								msg: 'Please try again later.',
							},
						}),
					);

					return EMPTY;
				}),
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe();
	}

	// for User
	borrowBook(addrId: string) {
		this.store.dispatch(
			BorrowsActions.borrowBook({ bookId: this.bookId, addrId }),
		);

		this.isBorrowModalOpen = false;
	}

	toggleBrrwModal() {
		this.isBorrowModalOpen = !this.isBorrowModalOpen;
	}

	ngOnInit(): void {
		this.store.dispatch(
			BooksActions.getBookAndNonRetBrrws({ bookId: this.bookId }),
		);

		this.book$.pipe(takeUntil(this.destroy$)).subscribe((book) => {
			if (!book) return;

			const {
				title,
				author,
				description,
				publishedAt,
				total,
				genres,
				coverUrl,
			} = book;

			this.initialValue['title'] = title;
			this.initialValue['total'] = total;

			if (author) this.initialValue.author = author;
			if (description) this.initialValue.description = description;
			if (publishedAt) {
				this.initialValue.publishedDate = unixToYMD(publishedAt);
			}
			if (genres) this.initialValue.genres = genres;
			if (coverUrl) this.initialValue.coverUrl = coverUrl;

			this.updateBookForm.patchValue(this.initialValue);
		});

		this.nonRetBrrws$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			if (value) {
				this.isDisableBorrow = value.some(
					(borrow) => borrow.book._id === this.bookId,
				);
				return;
			}

			this.store.dispatch(BorrowsActions.getNonRetBrrws({}));
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
