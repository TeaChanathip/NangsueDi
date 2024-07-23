import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState } from './alerts.reducer';

export const alertsKey = 'alerts';

export const selectAlerts = createFeatureSelector<AlertsState>(alertsKey);

export const selectAllAlerts = createSelector(
	selectAlerts,
	(state) => state.alerts,
);
