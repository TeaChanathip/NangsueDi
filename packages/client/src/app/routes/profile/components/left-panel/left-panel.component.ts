import { Component, Input, OnChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/interfaces/user.model';
import { FormTextComponent } from '../../../../shared/components/form-text/form-text.component';
import { getWarning } from '../../../../shared/utils/getWarning';

@Component({
	selector: 'app-left-panel',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		FormInputComponent,
		WarningMsgComponent,
		FormTextComponent,
	],
	templateUrl: './left-panel.component.html',
	styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent implements OnChanges {
	@Input({ required: true }) user$!: Observable<User | null>;
	@Input() firstNameErrors: ValidationErrors | null = null;
	@Input() lastNameErrors: ValidationErrors | null = null;
	@Input() phoneErrors: ValidationErrors | null = null;
	@Input() birthDateErrors: ValidationErrors | null = null;

	firstNameErrMsg: string = 'empty';
	lastNameErrMsg: string = 'empty';
	phoneErrMsg: string = 'empty';
	birthDateErrMsg: string = 'empty';

	ngOnChanges(): void {
		if (this.firstNameErrors) {
			this.firstNameErrMsg = getWarning(this.firstNameErrors);
		}
		if (this.lastNameErrors) {
			this.lastNameErrMsg = getWarning(this.lastNameErrors);
		}
		if (this.phoneErrors) {
			this.phoneErrMsg = getWarning(this.phoneErrors);
		}
		if (this.birthDateErrors) {
			this.birthDateErrMsg = getWarning(this.birthDateErrors);
		}
	}
}
