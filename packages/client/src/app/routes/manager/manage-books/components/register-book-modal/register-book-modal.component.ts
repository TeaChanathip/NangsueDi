import {
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { FormInputComponent } from '../../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../../shared/components/warning-msg/warning-msg.component';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { arrayEachValidator } from '../../../../../shared/validators/array-each.validator';
import { Store } from '@ngrx/store';
import * as BooksActions from '../../../../../stores/books/books.actions';
import { dtToUnix } from '../../../../../shared/utils/dtToUnix';
import { FormInputBoxComponent } from '../../../../../shared/components/form-input-box/form-input-box.component';
import { dtBeforeValidator } from '../../../../../shared/validators/datetime-before.validator';
import { imageUrlValidator } from '../../../../../shared/validators/image-url.validator';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Subject } from 'rxjs';
import { getWarning } from '../../../../../shared/utils/getWarning';
import {
	genreOptions,
	MAX_GENRE,
	MIN_GENRE,
} from '../../../../../shared/constants/genre.constant';
import {
	MAX_NAME,
	MAX_TEXT,
	MAX_TITLE,
} from '../../../../../shared/constants/min-max.constant';

@Component({
	selector: 'app-register-book-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		WarningMsgComponent,
		FormInputBoxComponent,
		ButtonComponent,
	],
	templateUrl: './register-book-modal.component.html',
	styleUrl: './register-book-modal.component.scss',
})
export class RegisterBookModalComponent implements OnInit, OnDestroy {
	@Output() toggleModal = new EventEmitter();

	today = new Date();
	genreOptions = genreOptions;

	registerBookForm = new FormGroup({
		title: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.maxLength(MAX_TITLE)],
		}),
		author: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.maxLength(2 * MAX_NAME)],
		}),
		description: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.maxLength(MAX_TEXT)],
		}),
		publishedDate: new FormControl<string>('', {
			nonNullable: true,
			validators: [dtBeforeValidator(this.today)],
		}),
		total: new FormControl<number>(1, {
			nonNullable: true,
			validators: [Validators.required, Validators.min(1)],
		}),
		genres: new FormControl<number[]>([], {
			nonNullable: true,
			validators: [
				arrayEachValidator(
					Validators.min(MIN_GENRE),
					Validators.max(MAX_GENRE),
				),
			],
		}),
		coverUrl: new FormControl<string>('', {
			nonNullable: true,
			validators: [imageUrlValidator()],
		}),
	});

	titleErrMsg: string = 'Required';
	pubDateErrMsg: string = 'empty';
	totalErrMsg: string = 'Required';
	coverUrlErrMsg: string = 'empty';

	destroy$ = new Subject<void>();

	constructor(private store: Store) {}

	onSubmit() {
		if (!this.registerBookForm.valid) return;

		console.log(this.registerBookForm.getRawValue());

		const {
			title,
			author,
			description,
			publishedDate,
			total,
			genres,
			coverUrl,
		} = this.registerBookForm.getRawValue();

		const publishedAt = dtToUnix(publishedDate);

		this.store.dispatch(
			BooksActions.registerBook({
				title,
				author,
				description,
				publishedAt,
				total,
				genres,
				coverUrl,
			}),
		);
	}

	emitToggleModal() {
		this.toggleModal.emit();
	}

	ngOnInit(): void {
		this.registerBookForm.controls['title'].statusChanges.subscribe(
			(status) => {
				if (status === 'INVALID') {
					this.titleErrMsg = getWarning(
						this.registerBookForm.controls['title'].errors,
					);
				}
			},
		);

		this.registerBookForm.controls['publishedDate'].statusChanges.subscribe(
			(status) => {
				if (status === 'INVALID') {
					this.pubDateErrMsg = getWarning(
						this.registerBookForm.controls['publishedDate'].errors,
					);
				}
			},
		);

		this.registerBookForm.controls['total'].statusChanges.subscribe(
			(status) => {
				if (status === 'INVALID') {
					this.totalErrMsg = getWarning(
						this.registerBookForm.controls['total'].errors,
					);
				}
			},
		);

		this.registerBookForm.controls['coverUrl'].statusChanges.subscribe(
			(status) => {
				if (status === 'INVALID') {
					this.coverUrlErrMsg = getWarning(
						this.registerBookForm.controls['coverUrl'].errors,
					);
				}
			},
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
