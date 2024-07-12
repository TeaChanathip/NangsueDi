import { Component, Input, OnChanges } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { getWarning } from '../../../../shared/utils/getWarning';

@Component({
	selector: 'app-second-step',
	standalone: true,
	imports: [ReactiveFormsModule, FormInputComponent, WarningMsgComponent],
	templateUrl: './second-step.component.html',
	styleUrl: './second-step.component.scss',
})
export class SecondStepComponent implements OnChanges {
	@Input() phoneNumberErrors: ValidationErrors | null = null;
	@Input() birthDateErrors: ValidationErrors | null = null;

	phoneNumberErrMsg: string = 'empty';
	birthDateErrMsg: string = 'empty';

	ngOnChanges(): void {
		if (this.phoneNumberErrors) {
			console.log(this.phoneNumberErrors);
			// this.phoneNumberErrMsg = getWarning(this.phoneNumberErrors);
		}
		if (this.birthDateErrors) {
			console.log(this.birthDateErrors);
			// this.birthDateErrMsg = getWarning(this.birthDateErrors);
		}
	}
}
