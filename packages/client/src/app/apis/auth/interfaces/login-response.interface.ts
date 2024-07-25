import { User } from '../../../shared/interfaces/user.model';

export interface LoginRes {
	accessToken: string;
	user: User;
}
