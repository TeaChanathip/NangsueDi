import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenusBarComponent } from './components/menus-bar/menus-bar.component';

@Component({
	selector: 'app-manage-users',
	standalone: true,
	imports: [RouterModule, MenusBarComponent],
	templateUrl: './manage-users.component.html',
	styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {}
