import { Component, Input } from '@angular/core';
import { UserAddr } from '../../../../../shared/interfaces/user-address.model';

@Component({
	selector: 'app-borrow-addr-item',
	standalone: true,
	imports: [],
	templateUrl: './borrow-addr-item.component.html',
	styleUrl: './borrow-addr-item.component.scss',
})
export class BorrowAddrItemComponent {
	@Input() addr!: UserAddr;
}
