import { Component, Input, OnChanges } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../../shared/components/warning-msg/warning-msg.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { getWarning } from '../../../../../shared/utils/getWarning';

@Component({
	selector: 'app-main-form',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		WarningMsgComponent,
		ButtonComponent,
	],
	templateUrl: './main-form.component.html',
	styleUrl: './main-form.component.scss',
})
export class MainFormComponent implements OnChanges {
	@Input() emailErrors: ValidationErrors | null = null;

	emailErrMsg: string = 'Required';

	ngOnChanges(): void {
		if (!this.emailErrors) {
			this.emailErrMsg = getWarning(this.emailErrors);
		}
	}
}
