import { Routes } from '@angular/router';
import { SearchComponent } from './routes/search/search.component';

export const routes: Routes = [
	{
		path: 'search',
		component: SearchComponent,
	},
	{
		path: 'my-shelf',
		component: SearchComponent,
	},
	{
		path: 'requests',
		component: SearchComponent,
	},
	{
		path: 'manage-books',
		component: SearchComponent,
	},
	{
		path: 'manage-users',
		component: SearchComponent,
	},
	{
		path: 'dashboard',
		component: SearchComponent,
	},
	{
		path: 'profile',
		component: SearchComponent,
	},
	{
		path: 'change-password',
		component: SearchComponent,
	},
];
