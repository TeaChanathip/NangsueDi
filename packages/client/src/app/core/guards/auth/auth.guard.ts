import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../stores/user/user.selectors';

export function authGuard(...roles: Role[]): CanActivateFn {
	return () => {
		const router = inject(Router);
		const userState$ = inject(Store).select(selectUser);

		return of(localStorage.getItem('accessToken')).pipe(
			switchMap((token) => {
				if (!token) {
					// No token found, redirect to login
					return of(router.createUrlTree(['/login']));
				}
				// Token exists, now check for user state validity
				return userState$.pipe(
					filter((userState) => userState.status !== 'loading'),
					map((userState) => {
						// maybe 'logged_out' or 'unauthorized'
						if (userState.status !== 'logged_in') {
							return router.createUrlTree(['/login']);
						}

						// User's status is 'logged_in', proceed with original logic
						// check if roles empty?
						if (roles.length === 0) {
							return true;
						}

						// if user's role is not allowed go to book-search page
						const userRole = userState.user!.role;
						return (
							roles.includes(userRole) ||
							router.createUrlTree(['/search'])
						);
					}),
					catchError(() => {
						// Handle any errors, such as token refresh failures, by redirecting to login
						return of(router.createUrlTree(['/login']));
					}),
				);
			}),
		);
	};
}
