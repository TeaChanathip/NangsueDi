import { Component, signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAX_TITLE } from '../../constants/min-max.constant';
import { dtBeforeValidator } from '../../validators/datetime-before.validator';
import { genreOptions } from '../../constants/genre.constant';
import { dtDurationValidator } from '../../validators/datetime-duration.validator';
import { CheckBoxComponent } from '../check-box/check-box.component';
import { ChangePwdComponent } from '../../../routes/user/change-pwd/change-pwd.component';
import { NgClass } from '@angular/common';
import { ClearButtonComponent } from '../clear-button/clear-button.component';
import { Params, Router } from '@angular/router';
import { dtToUnix } from '../../utils/dtToUnix';

@Component({
	selector: 'app-books-search-bar',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatTooltipModule,
		MatExpansionModule,
		CheckBoxComponent,
		ChangePwdComponent,
		ClearButtonComponent,
		NgClass,
	],
	templateUrl: './books-search-bar.component.html',
	styleUrl: './books-search-bar.component.scss',
})
export class BooksSearchBarComponent {
	today = new Date();
	genreOptions = genreOptions;

	searchBooksForm = new FormGroup(
		{
			bookKeyword: new FormControl<string>('', {
				nonNullable: true,
				validators: [Validators.maxLength(MAX_TITLE)],
			}),
			publishedBegin: new FormControl<string>('', {
				nonNullable: true,
				validators: [dtBeforeValidator(this.today)],
			}),
			publishedEnd: new FormControl<string>('', {
				nonNullable: true,
				validators: [dtBeforeValidator(this.today)],
			}),
			isAvailable: new FormControl<boolean>(false, {
				nonNullable: true,
			}),
		},
		{ validators: dtDurationValidator('published') },
	);

	checkedGenres: boolean[] = new Array<boolean>(genreOptions.length).fill(
		false,
	);
	sumGenres: number = 0; // for checking if there any genre filter applied

	isFilterOn: boolean = false;

	readonly generalPanelState = signal(false);
	readonly genresPanelState = signal(false);

	constructor(private router: Router) {}

	submit(event: Event) {
		event.preventDefault();

		const bookKeyword =
			this.searchBooksForm.controls['bookKeyword'].value.trim();

		const myQueryParams: Params = {
			...(bookKeyword && { bookKeyword }),
		};

		if (!this.isFilterOn) {
			this.router.navigate([this.router.url.split('?')[0]], {
				queryParams: myQueryParams,
				queryParamsHandling: 'merge',
			});
			return;
		}

		// define a query params
		const publishedBegin = dtToUnix(
			this.searchBooksForm.controls['publishedBegin'].value,
		);
		const publishedEnd = dtToUnix(
			this.searchBooksForm.controls['publishedEnd'].value,
		);
		const isAvailable = this.searchBooksForm.controls['isAvailable'].value;
		const genres = this.checkedGenres.flatMap((isChecked, index) =>
			isChecked ? [index] : [],
		);

		if (publishedBegin) {
			myQueryParams['publishedBegin'] = publishedBegin;
		}

		if (publishedEnd) {
			myQueryParams['publishedEnd'] = publishedEnd;
		}

		if (isAvailable) {
			myQueryParams['isAvailable'] = isAvailable;
		}

		if (genres.length > 0) {
			myQueryParams['genres'] = genres;
		}

		this.router.navigate([this.router.url.split('?')[0]], {
			queryParams: myQueryParams,
		});
	}

	toggleFilter() {
		this.isFilterOn = !this.isFilterOn;
	}

	toggleGenre(index: number) {
		if (this.checkedGenres[index]) {
			this.sumGenres--;
		} else {
			this.sumGenres++;
		}

		this.checkedGenres[index] = !this.checkedGenres[index];
	}

	clearBookKeyword(event: Event) {
		event.stopPropagation();
		this.searchBooksForm.controls['bookKeyword'].reset();
	}

	clearGenrealFilter(event: Event) {
		event.stopPropagation();
		this.searchBooksForm.controls['publishedBegin'].reset();
		this.searchBooksForm.controls['publishedEnd'].reset();
		this.searchBooksForm.controls['isAvailable'].reset();
	}

	clearGenresFilter(event: Event) {
		event.stopPropagation();
		this.sumGenres = 0;
		this.checkedGenres.fill(false);
	}
}
