import { Component, Input, OnChanges } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { getWarning } from '../../../../shared/utils/getWarning';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
	selector: 'app-thrid-step',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		WarningMsgComponent,
		ButtonComponent,
	],
	templateUrl: './thrid-step.component.html',
	styleUrl: './thrid-step.component.scss',
})
export class ThridStepComponent implements OnChanges {
	@Input() isValid: boolean = false;
	@Input() passwordErrors: ValidationErrors | null = null;
	@Input() pwdMismatch: boolean | null = null;

	errMsg: string = 'empty';

	ngOnChanges(): void {
		if (this.passwordErrors) {
			this.errMsg = getWarning(this.passwordErrors);
		} else if (this.pwdMismatch) {
			this.errMsg = 'Password are not matching';
		}
	}
}
