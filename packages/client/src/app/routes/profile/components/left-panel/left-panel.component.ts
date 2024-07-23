import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { WarningMsgComponent } from '../../../../shared/components/warning-msg/warning-msg.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/interfaces/user.model';
import { FormTextComponent } from '../../../../shared/components/form-text/form-text.component';

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
export class LeftPanelComponent {
	@Input({ required: true }) user$!: Observable<User | null>;
}
