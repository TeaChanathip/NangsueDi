import { Routes } from '@angular/router';
import { SearchComponent } from './routes/public/search/search.component';
import { ProfileComponent } from './routes/user/profile/profile.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { ForgotPwdComponent } from './routes/auth/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './routes/auth/reset-pwd/reset-pwd.component';
import { ChangePwdComponent } from './routes/user/change-pwd/change-pwd.component';
import { ManageUsersComponent } from './routes/admin/manage-users/manage-users.component';

export const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'forgot-password',
		component: ForgotPwdComponent,
	},
	{
		path: 'reset-password/:resetToken',
		component: ResetPwdComponent,
	},
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
		component: ManageUsersComponent,
	},
	{
		path: 'dashboard',
		component: SearchComponent,
	},
	{
		path: 'profile',
		component: ProfileComponent,
	},
	{
		path: 'change-password',
		component: ChangePwdComponent,
	},
	{ path: '**', redirectTo: '/search', pathMatch: 'full' },
];
