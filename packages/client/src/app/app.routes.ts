import { Routes } from '@angular/router';
import { SearchComponent } from './routes/search/search.component';
import { ProfileComponent } from './routes/profile/profile.component';
import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { ForgotPwdComponent } from './routes/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './routes/reset-pwd/reset-pwd.component';

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
		component: SearchComponent,
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
		component: SearchComponent,
	},
];
