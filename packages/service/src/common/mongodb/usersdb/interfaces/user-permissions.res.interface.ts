import { Types } from 'mongoose';
import { UsersModel } from '../schemas/users.schema';

export interface UserPermsRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    canBorrow: boolean;
    canReview: boolean;
}
