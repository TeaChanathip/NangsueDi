import { Routes } from '@angular/router';
import { SearchComponent } from './routes/public/search/search.component';
import { ProfileComponent } from './routes/user/profile/profile.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { ForgotPwdComponent } from './routes/auth/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './routes/auth/reset-pwd/reset-pwd.component';
import { ChangePwdComponent } from './routes/user/change-pwd/change-pwd.component';
import { ManageUsersComponent } from './routes/admin/manage-users/manage-users.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { Role } from './shared/enums/role.enum';

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
		path: 'profile',
		component: ProfileComponent,
		canActivate: [authGuard()],
	},
	{
		path: 'change-password',
		component: ChangePwdComponent,
		canActivate: [authGuard()],
	},
	{
		path: 'search',
		component: SearchComponent,
	},
	{
		path: 'my-shelf',
		component: SearchComponent,
		canActivate: [authGuard(Role.USER)],
	},
	{
		path: 'requests',
		component: SearchComponent,
		canActivate: [authGuard(Role.MANAGER, Role.ADMIN)],
	},
	{
		path: 'manage-books',
		component: SearchComponent,
		canActivate: [authGuard(Role.MANAGER, Role.ADMIN)],
	},
	{
		path: 'manage-users',
		component: ManageUsersComponent,
		canActivate: [authGuard(Role.ADMIN)],
	},
	{
		path: 'dashboard',
		component: SearchComponent,
		canActivate: [authGuard(Role.ADMIN)],
	},
	{ path: '**', redirectTo: '/search', pathMatch: 'full' },
];
