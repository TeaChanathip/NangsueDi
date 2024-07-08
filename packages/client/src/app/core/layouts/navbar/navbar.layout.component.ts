import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user-interface.model';
import { Role } from '../../../shared/enums/role.enum';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [],
	templateUrl: './navbar.layout.component.html',
	styleUrl: './navbar.layout.component.scss',
})
export class NavbarLayout implements OnInit {
	iconUrl = 'Icon.svg';

	navbarRoutes: [string, string][] = [];

	// mockup
	user: UserModel = {
		_id: '1',
		email: 'jonathan@gmail.com',
		phone: '0621111111',
		firstName: 'Jonathan',
		lastName: 'Jordan',
		birthTime: 3243242,
		avartarUrl: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Jonathan',
		role: Role.ADMIN,
		registeredAt: 3243242,
	};

	ngOnInit(): void {
		switch (this.user?.role) {
			case 'USER': {
				this.navbarRoutes = [
					['search', 'navbar-icons/search.svg'],
					['my shelf', 'navbar-icons/my-shelf.svg'],
				];
				break;
			}
			case 'MANAGER': {
				this.navbarRoutes = [
					['search', 'navbar-icons/search.svg'],
					['requests', 'navbar-icons/requests.svg'],
					['manage books', 'navbar-icons/manage-books.svg'],
				];
				break;
			}
			case 'ADMIN': {
				this.navbarRoutes = [
					['search', 'navbar-icons/search.svg'],
					['requests', 'navbar-icons/requests.svg'],
					['manage books', 'navbar-icons/manage-books.svg'],
					['manage users', 'navbar-icons/manage-users.svg'],
					['dashboard', 'navbar-icons/dashboard.svg'],
				];
				break;
			}
			default: {
				this.navbarRoutes = [['search', 'navbar-icons/search.svg']];
			}
		}
	}
}
