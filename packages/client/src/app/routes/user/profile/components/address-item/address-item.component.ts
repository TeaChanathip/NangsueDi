import { NgClass } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { UserAddr } from '../../../../../shared/interfaces/user-address.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import * as UserAddrsActions from '../../../../../stores/user-addresses/user-addresses.actions';

@Component({
	selector: 'app-address-item',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, MatTooltipModule],
	templateUrl: './address-item.component.html',
	styleUrl: './address-item.component.scss',
})
export class AddressItemComponent implements OnInit, OnChanges {
	@Input() addrData: UserAddr | null = null; // if null, add new address
	@Output() closeNewFormEvent = new EventEmitter();

	isEditting: boolean = false;

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

	constructor(private store: Store) {}

	dismissEdit() {
		if (this.addrData) {
			this.resetForm();
			this.isEditting = false;
			return;
		}

		this.closeNewFormEvent.emit();
	}

	editAddr() {
		this.isEditting = true;
	}

	saveAddr() {
		if (!this.addressForm.valid) return;

		const { address, subDistrict, district, province, postalCode } =
			this.addressForm.getRawValue();

		// update
		if (this.addrData) {
			this.store.dispatch(
				UserAddrsActions.updateUserAddr({
					_id: this.addrData._id,
					...(address && { address }),
					...(subDistrict && { subDistrict }),
					...(district && { district }),
					...(province && { province }),
					...(postalCode && { postalCode }),
				}),
			);
			return;
		}

		// add new
		this.store.dispatch(
			UserAddrsActions.addNewUserAddr({
				address,
				subDistrict,
				district,
				province,
				postalCode,
			}),
		);
	}

	deleteAddr() {
		if (!this.addrData) return;
		this.store.dispatch(
			UserAddrsActions.deleteUserAddr({ _id: this.addrData?._id }),
		);
	}

	resetForm() {
		if (!this.addrData) return;
		this.addressForm.patchValue(this.addrData);
	}

	ngOnInit(): void {
		if (this.addrData) {
			this.resetForm();
			return;
		}

		this.isEditting = true;
	}

	ngOnChanges(): void {
		if (!this.addrData) return;

		const formRawValue = this.addressForm.getRawValue();
		if (
			this.isEditting &&
			formRawValue.address === this.addrData.address &&
			formRawValue.subDistrict === this.addrData.subDistrict &&
			formRawValue.district === this.addrData.district &&
			formRawValue.province === this.addrData.province &&
			formRawValue.postalCode === this.addrData.postalCode
		) {
			this.isEditting = false;
		}
	}
}
