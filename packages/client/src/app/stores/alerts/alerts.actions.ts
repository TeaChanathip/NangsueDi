import { createAction, props } from '@ngrx/store';
import { AlertMsg } from '../../shared/components/alert/alert.component';

export const pushAlert = createAction(
	'[Alert Layout] Push Alert',
	props<{ alert: AlertMsg }>(),
);

export const removeAlert = createAction(
	'[Alert Layout] Remove Alert',
	props<{ index: number }>(),
);
