import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserAddr } from '../../../../shared/interfaces/user-address.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AddressItemComponent } from '../address-item/address-item.component';
import { Store } from '@ngrx/store';
import { selectUserAddrsStatus } from '../../../../stores/user-addresses/user-addresses.selectors';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'app-right-panel',
	standalone: true,
	imports: [AsyncPipe, AddressItemComponent, MatTooltipModule],
	templateUrl: './right-panel.component.html',
	styleUrl: './right-panel.component.scss',
})
export class RightPanelComponent implements OnInit, OnDestroy {
	@Input() userAddrs$!: Observable<UserAddr[] | null>;

	isNewFormShowing: boolean = false;

	private destroy$ = new Subject<void>();

	constructor(private store: Store) {}

	toggleNewForm(state: boolean) {
		this.isNewFormShowing = state;
	}

	ngOnInit(): void {
		this.store
			.select(selectUserAddrsStatus)
			.pipe(takeUntil(this.destroy$))
			.subscribe((status) => {
				if (status === 'added') {
					this.isNewFormShowing = false;
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
