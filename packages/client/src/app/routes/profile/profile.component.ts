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
import { selectCurrUser } from '../../stores/user/user.selectors';
import { UserAddr } from '../../shared/interfaces/user-address.model';
import { selectAllUserAddrs } from '../../stores/user-addresses/user-addresses.selectors';
import { MAX_NAME } from '../../shared/constants/min-max.constant';
import { dtAgeValidator } from '../../shared/validators/datetime-age.validator';
import * as UserAddrsActions from '../../stores/user-addresses/user-addresses.actions';
import { unixToYMD } from '../../shared/utils/unixToYMD';
import { ButtonComponent } from '../../shared/components/button/button.component';

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
	userAddr$: Observable<UserAddr[] | null>;

	updateProfileForm: FormGroup | null = null;
	private destroy$ = new Subject<void>();

	constructor(private store: Store) {
		this.user$ = this.store.select(selectCurrUser);
		this.userAddr$ = this.store.select(selectAllUserAddrs);
	}

	ngOnInit(): void {
		this.store.dispatch(UserAddrsActions.getAllUserAddrs());
		this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
			if (!user) {
				return;
			}

			this.updateProfileForm = new FormGroup({
				firstName: new FormControl<string>(user.firstName, {
					nonNullable: true,
					validators: [
						Validators.pattern('^[A-Za-z]+$'),
						Validators.maxLength(MAX_NAME),
					],
				}),
				lastName: new FormControl<string | undefined>(user?.lastName, {
					nonNullable: true,
					validators: [
						Validators.pattern('^[A-Za-z]+$'),
						Validators.maxLength(MAX_NAME),
					],
				}),
				phone: new FormControl<string>(user.phone, {
					nonNullable: true,
					validators: [Validators.pattern('^0\\d{9}$')],
				}),
				birthDate: new FormControl<string>(unixToYMD(user.birthTime), {
					nonNullable: true,
					validators: [dtAgeValidator(12)],
				}),
			});
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
