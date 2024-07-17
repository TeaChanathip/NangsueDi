import { Component, OnInit, signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAX_TITLE } from '../../../../shared/constants/min-max.constant';
import { dtBeforeValidator } from '../../../../shared/validators/datetime-before.validator';
import { arrayEachValidator } from '../../../../shared/validators/array-each.validator';
import {
	genreOptions,
	MAX_GENRE,
	MIN_GENRE,
} from '../../../../shared/constants/genre.constant';
import { dtDurationValidator } from '../../../../shared/validators/datetime-duration.validator';
import { CheckBoxComponent } from '../../../../shared/components/check-box/check-box.component';
import { ChangePwdComponent } from '../../../change-pwd/change-pwd.component';
import { NgClass } from '@angular/common';
import { ClearButtonComponent } from '../clear-button/clear-button.component';

@Component({
	selector: 'app-search-bar',
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
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
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
			genres: new FormControl<number[]>([], {
				nonNullable: true,
				validators: arrayEachValidator(
					Validators.min(MIN_GENRE),
					Validators.max(MAX_GENRE),
				),
			}),
		},
		{ validators: dtDurationValidator('published') },
	);

	isFilterOn: boolean = true;

	readonly generalPanelState = signal(false);
	readonly genresPanelState = signal(false);

	applySearchKeyword() {}

	toggleFilter() {
		this.isFilterOn = !this.isFilterOn;
	}

	clearGenrealFilter(event: Event) {
		event.stopPropagation();
		this.searchBooksForm.controls['publishedBegin'].reset();
		this.searchBooksForm.controls['publishedEnd'].reset();
		this.searchBooksForm.controls['isAvailable'].reset();
	}

	clearGenresFilter(event: Event) {
		event.stopPropagation();
		this.searchBooksForm.controls['genres'].reset();
	}

	ngOnInit(): void {
		this.searchBooksForm.statusChanges.subscribe((status) => {
			if (status === 'INVALID') {
				console.log(
					'Form is invalid. Errors:',
					this.searchBooksForm.errors,
				);
			}
		});

		this.searchBooksForm.valueChanges.subscribe((value) => {
			console.log(value);
		});
	}

	clearButtonCls =
		'px-4 py-1 text-lg text-white font-semibold rounded-lg bg-primary-100 hover:bg-primary-300 disabled:bg-slate-300';
}
