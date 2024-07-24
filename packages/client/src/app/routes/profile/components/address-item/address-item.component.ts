import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'app-address-item',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './address-item.component.html',
	styleUrl: './address-item.component.scss',
})
export class AddressItemComponent {
	@Input() isNew: boolean = false;

	addressForm = new FormGroup({
		address: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required],
		}),
		subDistrict: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required],
		}),
		district: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required],
		}),
		province: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required],
		}),
		postalCode: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required],
		}),
	});
}
