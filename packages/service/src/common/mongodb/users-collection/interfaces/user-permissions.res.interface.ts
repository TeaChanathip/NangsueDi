import { Types } from 'mongoose';
import { UsersModel } from 'src/common/mongodb/users-collection/schemas/users.schema';

export interface UserPermissionsRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    canBorrow: boolean;
    canReview: boolean;
}
