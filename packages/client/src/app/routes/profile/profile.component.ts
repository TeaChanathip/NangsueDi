import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../shared/components/warning-msg/warning-msg.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/interfaces/user.model';
import { Store } from '@ngrx/store';
import {
	selectCurrUser,
	selectUserStatus,
} from '../../stores/user/user.selectors';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import { selectAllUserAddrs } from '../../stores/user-addresses/user-addresses.selectors';
import { MAX_NAME } from '../../shared/constants/min-max.constant';
import { dtAgeValidator } from '../../shared/validators/datetime-age.validator';
import * as UserActions from '../../stores/user/user.actions';
import * as UserAddrsActions from '../../stores/user-addresses/user-addresses.actions';
import * as AlertsActions from '../../stores/alerts/alerts.actions';
import { unixToYMD } from '../../shared/utils/unixToYMD';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { dtToUnix } from '../../shared/utils/dtToUnix';
import { UserStatus } from '../../stores/user/user.reducer';
import { AlertMsg } from '../../shared/components/alert/alert.component';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		WarningMsgComponent,
		LeftPanelComponent,
		RightPanelComponent,
		ButtonComponent,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
	user$: Observable<User | null>;
	userStatus$: Observable<UserStatus | null>;
	userAddr$: Observable<UserAddr[] | null>;

	updateProfileForm = new FormGroup({
		firstName: new FormControl<string>('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.pattern('^[A-Za-z]+$'),
				Validators.maxLength(MAX_NAME),
			],
		}),
		lastName: new FormControl<string | undefined>('', {
			nonNullable: true,
			validators: [
				Validators.pattern('^[A-Za-z]+$'),
				Validators.maxLength(MAX_NAME),
			],
		}),
		phone: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.pattern('^0\\d{9}$')],
		}),
		birthDate: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, dtAgeValidator(12)],
		}),
	});

	initialValue: {
		firstName: string;
		lastName?: string;
		phone: string;
		birthDate: string;
	} | null = null;

	isFormEdited: boolean = false;

	private destroy$ = new Subject<void>();

	constructor(private store: Store) {
		this.user$ = this.store.select(selectCurrUser);
		this.userStatus$ = this.store.select(selectUserStatus);
		this.userAddr$ = this.store.select(selectAllUserAddrs);
	}

	onSubmit() {
		if (!this.updateProfileForm?.valid || !this.isFormEdited) {
			return;
		}

		const value = this.updateProfileForm.getRawValue();
		const payload = {
			firstName: value.firstName,
			...(value.lastName !== undefined && { lastName: value.lastName }),
			phone: value.phone,
			birthTime: dtToUnix(value.birthDate),
		};
		// console.log(payload);
		this.store.dispatch(UserActions.updateProfile(payload));
	}

	ngOnInit(): void {
		this.store.dispatch(UserAddrsActions.getAllUserAddrs());

		// for tracking change of user in the store
		this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
			if (!user) {
				return;
			}

			this.initialValue = {
				firstName: user.firstName,
				lastName: user.lastName,
				phone: user.phone,
				birthDate: unixToYMD(user.birthTime),
			};

			this.updateProfileForm.patchValue(this.initialValue);
		});

		// for tracking if the form is edited (to correctly disable the button)
		this.updateProfileForm.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((value) => {
				this.isFormEdited =
					JSON.stringify(this.initialValue) !== JSON.stringify(value);
			});

		// show alert for acknowledge the user
		this.userStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
			let alert: AlertMsg | null = null;
			switch (status) {
				case 'updated': {
					alert = {
						kind: 'success',
						header: 'profile updated',
					};
					break;
				}
				case 'error': {
					alert = {
						kind: 'fail',
						header: 'cannot update profile',
						msg: 'Please try again later.',
					};
					break;
				}
				default: {
					return;
				}
			}

			this.store.dispatch(
				AlertsActions.pushAlert({
					alert,
				}),
			);
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
