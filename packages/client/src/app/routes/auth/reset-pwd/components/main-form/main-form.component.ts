import { Component, Input, OnChanges } from '@angular/core';
import { FormInputComponent } from '../../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../../shared/components/warning-msg/warning-msg.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ValidationErrors } from '@angular/forms';
import { getWarning } from '../../../../../shared/utils/getWarning';

@Component({
	selector: 'app-main-form',
	standalone: true,
	imports: [FormInputComponent, WarningMsgComponent, ButtonComponent],
	templateUrl: './main-form.component.html',
	styleUrl: './main-form.component.scss',
})
export class MainFormComponent implements OnChanges {
	@Input() pwdErrors: ValidationErrors | null = null;
	@Input() pwdMismatch: boolean = false;

	errorMsg: string = 'empty';

	ngOnChanges(): void {
		if (this.pwdErrors) {
			this.errorMsg = getWarning(this.pwdErrors);
		} else if (this.pwdMismatch) {
			this.errorMsg = 'Password are not matching';
		}
	}
}
