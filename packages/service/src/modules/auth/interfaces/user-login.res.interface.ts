import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';

export interface UserLoginRes {
    accessToken: string;
    user: UserFiltered;
}
