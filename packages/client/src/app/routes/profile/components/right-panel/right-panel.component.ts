import { Component, Input } from '@angular/core';
import { UserAddr } from '../../../../shared/interfaces/user-address.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AddressItemComponent } from '../address-item/address-item.component';

@Component({
	selector: 'app-right-panel',
	standalone: true,
	imports: [AsyncPipe, AddressItemComponent],
	templateUrl: './right-panel.component.html',
	styleUrl: './right-panel.component.scss',
})
export class RightPanelComponent {
	@Input() userAddrs$!: Observable<UserAddr[] | null>;
}
