import { Component, Input, OnChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { getWarning } from '../../../../shared/utils/getWarning';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
	selector: 'app-main-form',
	standalone: true,
	imports: [FormInputComponent, WarningMsgComponent, ButtonComponent],
	templateUrl: './main-form.component.html',
	styleUrl: './main-form.component.scss',
})
export class MainFormComponent implements OnChanges {
	@Input() pwdErrors: ValidationErrors | null = null;
	@Input() newPwdErrors: ValidationErrors | null = null;

	pwdErrMsg: string = 'empty';
	newPwdErrMsg: string = 'empty';

	ngOnChanges(): void {
		if (this.pwdErrors) {
			this.pwdErrMsg = getWarning(this.pwdErrors);
		}
		if (this.newPwdErrors) {
			this.newPwdErrMsg = getWarning(this.newPwdErrors);
		}
	}
}
