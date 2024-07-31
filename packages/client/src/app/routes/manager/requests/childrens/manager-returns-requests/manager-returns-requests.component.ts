import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Return } from '../../../../../shared/interfaces/return.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllMgrRets } from '../../../../../stores/manager-returns/manager-returns.selectors';
import * as MgrRetsActions from '../../../../../stores/manager-returns/manager-returns.actions';
import { FormTextComponent } from '../../../../../shared/components/form-text/form-text.component';
import { unixToYMD } from '../../../../../shared/utils/unixToYMD';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
	selector: 'app-manager-returns-requests',
	standalone: true,
	imports: [AsyncPipe, FormTextComponent, ButtonComponent],
	templateUrl: './manager-returns-requests.component.html',
	styleUrl: './manager-returns-requests.component.scss',
})
export class ManagerReturnsRequestsComponent implements OnInit {
	userRetsReqs$: Observable<Return[] | null>;

	limit: number = 40;
	page: number = 1;

	constructor(private store: Store) {
		this.userRetsReqs$ = this.store.select(selectAllMgrRets);
	}

	unixToYMD(unix: number) {
		return unixToYMD(unix);
	}

	approve(returnId: string) {
		this.store.dispatch(MgrRetsActions.approveReturns({ returnId }));
	}

	reject(returnId: string) {
		this.store.dispatch(MgrRetsActions.rejectReturns({ returnId }));
	}

	ngOnInit(): void {
		this.store.dispatch(
			MgrRetsActions.getUserReturns({
				isApproved: 0,
				isRejected: 0,
				// limit: this.limit,
				// page: this.page,
			}),
		);
	}
}
