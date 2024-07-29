import { Component, Input } from '@angular/core';
import { User } from '../../../../../shared/interfaces/user.model';

@Component({
	selector: 'app-user-item',
	standalone: true,
	imports: [],
	templateUrl: './user-item.component.html',
	styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
	@Input({ required: true }) user!: User;
}
