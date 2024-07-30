import {
	ApplicationConfig,
	provideZoneChangeDetection,
	isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './stores/user/user.reducer';
import { UserEffect } from './stores/user/user.effects';
import { booksReducer } from './stores/books/books.reducer';
import { BooksEffect } from './stores/books/books.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserAddrsEffect } from './stores/user-addresses/user-addresses.effects';
import { userAddrsReducer } from './stores/user-addresses/user-addresses.reducer';
import { alertsReducer } from './stores/alerts/alerts.reducer';
import { adminUsersReducer } from './stores/admin-users/admin-users.reducer';
import { AdminUsersEffect } from './stores/admin-users/admin-users.effects';
import { BorrowsEffect } from './stores/borrows/borrows.effects';
import { borrowsReducer } from './stores/borrows/borrows.reducer';
import { mgrBrrwsReducer } from './stores/manager-borrows/manager-borrows.reducer';
import { MgrBrrwsEffect } from './stores/manager-borrows/manager-borrows.effects';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideStore(),
		provideState({ name: 'user', reducer: userReducer }),
		provideState({ name: 'books', reducer: booksReducer }),
		provideState({ name: 'userAddrs', reducer: userAddrsReducer }),
		provideState({ name: 'alerts', reducer: alertsReducer }),
		provideState({ name: 'adminUsers', reducer: adminUsersReducer }),
		provideState({ name: 'borrows', reducer: borrowsReducer }),
		provideState({ name: 'mgrBrrws', reducer: mgrBrrwsReducer }),
		provideEffects(
			UserEffect,
			BooksEffect,
			UserAddrsEffect,
			AdminUsersEffect,
			BorrowsEffect,
			MgrBrrwsEffect,
		),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideAnimationsAsync(),
	],
};
