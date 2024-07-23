import { Component, Input, OnChanges } from '@angular/core';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { ValidationErrors } from '@angular/forms';
import { getWarning } from '../../../../shared/utils/getWarning';

@Component({
	selector: 'app-first-step',
	standalone: true,
	imports: [FormInputComponent, WarningMsgComponent],
	templateUrl: './first-step.component.html',
	styleUrl: './first-step.component.scss',
})
export class FirstStepComponent implements OnChanges {
	@Input() emailErrors: ValidationErrors | null = null;
	@Input() firstNameErrors: ValidationErrors | null = null;
	@Input() lastNameErrors: ValidationErrors | null = null;

	emailErrMsg: string = 'empty';
	firstNameErrMsg: string = 'empty';
	lastNameErrMsg: string = 'empty';

	ngOnChanges(): void {
		this.emailErrMsg = getWarning(this.emailErrors);
		this.firstNameErrMsg = getWarning(this.firstNameErrors);
		this.lastNameErrMsg = getWarning(this.lastNameErrors);
	}
}
