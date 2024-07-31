import { Routes } from '@angular/router';
import { SearchBooksComponent } from './routes/public/search-books/search-books.component';
import { ProfileComponent } from './routes/user/profile/profile.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { ForgotPwdComponent } from './routes/auth/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './routes/auth/reset-pwd/reset-pwd.component';
import { ChangePwdComponent } from './routes/user/change-pwd/change-pwd.component';
import { ManageUsersComponent } from './routes/admin/manage-users/manage-users.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { Role } from './shared/enums/role.enum';
import { SearchUsersComponent } from './routes/admin/manage-users/childrens/search-users/search-users.component';
import { ManageBooksComponent } from './routes/manager/manage-books/manage-books.component';
import { BookComponent } from './routes/public/book/book.component';
import { RequestsComponent } from './routes/manager/requests/requests.component';
import { MyShelfComponent } from './routes/user/my-shelf/my-shelf.component';
import { NonReturnedComponent } from './routes/user/my-shelf/childrens/non-returned/non-returned.component';
import { RejectedComponent } from './routes/user/my-shelf/childrens/rejected/rejected.component';
import { PendingComponent } from './routes/user/my-shelf/childrens/pending/pending.component';

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
		path: 'search-books',
		component: SearchBooksComponent,
	},
	{
		path: 'book/:bookId',
		component: BookComponent,
	},
	{
		path: 'my-shelf',
		component: MyShelfComponent,
		canActivate: [authGuard(Role.USER)],
		children: [
			{
				path: 'non-returned',
				component: NonReturnedComponent,
			},
			{
				path: 'rejected',
				component: RejectedComponent,
			},
			{
				path: 'pending',
				component: PendingComponent,
			},
			{
				path: '**',
				redirectTo: 'non-returned',
				pathMatch: 'full',
			},
		],
	},
	{
		path: 'requests',
		component: RequestsComponent,
		canActivate: [authGuard(Role.MANAGER, Role.ADMIN)],
	},
	{
		path: 'manage-books',
		component: ManageBooksComponent,
		canActivate: [authGuard(Role.MANAGER, Role.ADMIN)],
	},
	{
		path: 'manage-users',
		component: ManageUsersComponent,
		canActivate: [authGuard(Role.ADMIN)],
		children: [
			{
				path: 'search-users',
				component: SearchUsersComponent,
			},
			{
				path: '**',
				redirectTo: 'search-users',
				pathMatch: 'full',
			},
		],
	},
	{
		path: 'dashboard',
		component: SearchBooksComponent,
		canActivate: [authGuard(Role.ADMIN)],
	},
	{ path: '**', redirectTo: '/login', pathMatch: 'full' },
];
