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

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideStore(),
		provideState({ name: 'user', reducer: userReducer }),
		provideState({ name: 'books', reducer: booksReducer }),
		provideEffects(UserEffect, BooksEffect),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideAnimationsAsync(),
		provideAnimationsAsync(),
	],
};
