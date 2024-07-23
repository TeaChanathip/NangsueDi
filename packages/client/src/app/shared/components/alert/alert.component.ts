import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import * as AlertsActions from '../../../stores/alerts/alerts.actions';
import { selectAllAlerts } from '../../../stores/alerts/alerts.selectors';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [NgClass, AsyncPipe],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
})
export class AlertComponent implements OnInit, OnDestroy {
	// alerts: AlertMsg[] = [
	// 	{
	// 		kind: 'success',
	// 		header: 'test success',
	// 		msg: 'this is just a test for an alert of success action',
	// 	},
	// 	{
	// 		kind: 'fail',
	// 		header: 'test fail',
	// 		msg: 'this is just a test for an alert of fail action',
	// 	},
	// 	{
	// 		kind: 'warning',
	// 		header: 'test warning',
	// 		msg: 'this is just a test for an alert of warning',
	// 	},
	// ];

	alerts$: Observable<AlertMsg[] | null>;

	destroy$ = new Subject<void>();

	constructor(private store: Store) {
		this.alerts$ = this.store.select(selectAllAlerts);
	}

	ngOnInit(): void {
		// this.alerts$.pipe(takeUntil(this.destroy$)).subscribe((alerts) => {});
		return;
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	close(index: number) {
		this.store.dispatch(AlertsActions.removeAlert({ index }));
	}
}

export interface AlertMsg {
	kind: 'success' | 'fail' | 'warning';
	header?: string;
	msg?: string;
}
