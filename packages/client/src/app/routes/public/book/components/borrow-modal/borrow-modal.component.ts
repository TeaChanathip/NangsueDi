import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAddr } from '../../../../../shared/interfaces/user-address.model';
import { Store } from '@ngrx/store';
import { selectAllUserAddrs } from '../../../../../stores/user-addresses/user-addresses.selectors';
import * as UserAddrsActions from '../../../../../stores/user-addresses/user-addresses.actions';
import { AsyncPipe, NgClass } from '@angular/common';
import { BorrowAddrItemComponent } from '../borrow-addr-item/borrow-addr-item.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
	selector: 'app-borrow-modal',
	standalone: true,
	imports: [AsyncPipe, BorrowAddrItemComponent, ButtonComponent, NgClass],
	templateUrl: './borrow-modal.component.html',
	styleUrl: './borrow-modal.component.scss',
})
export class BorrowModalComponent implements OnInit {
	@Output() toggleModal = new EventEmitter();
	@Output() submitBorrow = new EventEmitter<string>();

	addrs$: Observable<UserAddr[] | null>;

	selected: string | null = null;

	constructor(private store: Store) {
		this.addrs$ = this.store.select(selectAllUserAddrs);
	}

	toggleSelect(addrId: string) {
		if (addrId === this.selected) {
			this.selected = null;
		} else {
			this.selected = addrId;
		}
	}

	emitToggleModal() {
		this.toggleModal.emit();
	}

	emitSubmitBorrow() {
		if (!this.selected) return;

		this.submitBorrow.emit(this.selected);
	}

	ngOnInit(): void {
		this.store.dispatch(UserAddrsActions.getAllUserAddrs());
	}
}
