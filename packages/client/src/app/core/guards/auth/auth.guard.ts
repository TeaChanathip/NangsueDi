import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../stores/user/user.selectors';

export function authGuard(...roles: Role[]): CanActivateFn {
	return (): boolean | UrlTree | Observable<boolean | UrlTree> => {
		const accessToken = localStorage.getItem('accessToken');

		const router = inject(Router);

		// User have not been logged in
		if (!accessToken) return router.createUrlTree(['/login']);

		// get user state from ngrx
		const userState$ = inject(Store).select(selectUser);

		// check status, if 'user' is available
		return userState$.pipe(
			map((userState) => {
				if (!userState.user) {
					return router.createUrlTree(['/login']);
				}

				if (roles.length === 0) {
					return true;
				}

				const userRole = userState.user.role;
				return (
					roles.includes(userRole) ||
					router.createUrlTree(['/search'])
				);
			}),
		);
	};
}
