import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as AlertsActions from '../../../stores/alerts/alerts.actions';
import { selectAllAlerts } from '../../../stores/alerts/alerts.selectors';
import { sleep } from '../../utils/sleep';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [NgClass, AsyncPipe],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
})
export class AlertComponent implements OnInit, OnDestroy {
	alerts$: Observable<AlertMsg[] | null>;

	shouldProceed: boolean = true;
	timer: ReturnType<typeof setTimeout> | undefined = undefined;

	destroy$ = new Subject<void>();

	constructor(private store: Store) {
		this.alerts$ = this.store.select(selectAllAlerts);
	}

	fadeOldestAlert(isFadeOut: boolean) {
		const oldest = document.getElementsByClassName('oldest');
		const element = oldest.item(0) as HTMLElement | null;
		if (!element) {
			return;
		}
		element.style.transition = isFadeOut
			? 'visibility 1s, opacity 1s linear'
			: '';
		element.style.opacity = isFadeOut ? '0' : '0.9';
		element.style.visibility = isFadeOut ? 'hidden' : 'visible';
	}

	stopTimer() {
		clearTimeout(this.timer);
		this.shouldProceed = false;
		this.fadeOldestAlert(false);
	}

	async startTimer() {
		clearTimeout(this.timer);
		this.shouldProceed = true;
		this.timer = setTimeout(async () => {
			this.fadeOldestAlert(true);
			await sleep(1000);
			if (!this.shouldProceed) return;
			this.fadeOldestAlert(false);
			this.store.dispatch(AlertsActions.removeAlert({ index: 0 }));
		}, 3000);
	}

	ngOnInit(): void {
		this.alerts$.pipe(takeUntil(this.destroy$)).subscribe((alerts) => {
			if (!alerts) {
				return;
			}

			this.startTimer();
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	getNgClass(kind: 'success' | 'fail' | 'warning', index: number): string {
		return `alert ${kind} ${index === 0 ? 'oldest' : ''}`;
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
