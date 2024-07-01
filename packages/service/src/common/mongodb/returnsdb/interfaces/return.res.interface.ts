import { BorrowsModel } from '../../borrowsdb/schemas/borrows.schema';
import { Types } from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';

export interface ReturnRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    borrowId: BorrowsModel;
    requestedAt: number;
    approvedAt?: number;
    rejectedAt?: number;
}
