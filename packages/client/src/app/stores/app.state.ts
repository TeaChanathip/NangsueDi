import { UserState } from './user/user.reducer';

export interface AppState {
	reducer: {
		user: UserState;
	};
}
