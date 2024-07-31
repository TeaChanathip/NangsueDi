import {
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../../shared/components/warning-msg/warning-msg.component';
import {
	MAX_PWD,
	MIN_PWD,
} from '../../../../../shared/constants/min-max.constant';
import { getWarning } from '../../../../../shared/utils/getWarning';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../../../stores/user/user.actions';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
	selector: 'app-delete-profile-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		WarningMsgComponent,
		ButtonComponent,
	],
	templateUrl: './delete-profile-modal.component.html',
	styleUrl: './delete-profile-modal.component.scss',
})
export class DeleteProfileModalComponent implements OnInit, OnDestroy {
	@Output() toggleModal = new EventEmitter();

	pwdErrMsg: string = 'empty';

	passwordForm = new FormGroup({
		password: new FormControl<string>('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.minLength(MIN_PWD),
				Validators.maxLength(MAX_PWD),
			],
		}),
	});

	destroy$ = new Subject<void>();

	constructor(private store: Store) {}

	emitToggleModal() {
		this.toggleModal.emit();
	}

	deleteProfile(password: string) {
		if (!this.passwordForm.valid) return;

		return this.store.dispatch(UserActions.deleteProfile({ password }));
	}

	ngOnInit(): void {
		this.passwordForm.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				if (this.passwordForm.controls['password'].errors !== null) {
					this.pwdErrMsg = getWarning(
						this.passwordForm.controls['password'].errors,
					);
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
