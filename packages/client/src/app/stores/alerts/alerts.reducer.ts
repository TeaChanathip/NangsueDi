import { createReducer, on } from '@ngrx/store';
import { AlertMsg } from '../../core/layouts/alert/alert.component';
import * as AlertsActions from './alerts.actions';

export interface AlertsState {
	alerts: AlertMsg[];
}

export const initialState: AlertsState = {
	alerts: [],
};

export const alertsReducer = createReducer(
	initialState,

	on(
		AlertsActions.pushAlert,
		(state, { alert }): AlertsState => ({
			...state,
			alerts: [...state.alerts, alert],
		}),
	),

	on(AlertsActions.removeAlert, (state, { index }): AlertsState => {
		if (index < 0 || index >= state.alerts.length) {
			return state;
		}

		return {
			...state,
			alerts: [
				...state.alerts.slice(0, index),
				...state.alerts.slice(index + 1),
			],
		};
	}),
);
