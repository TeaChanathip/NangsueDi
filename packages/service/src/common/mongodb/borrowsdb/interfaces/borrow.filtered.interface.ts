import { Types } from 'mongoose';
import { UserFiltered } from '../../../../shared/interfaces/user.filtered.res.interface';
import { BookRes } from '../../booksdb/interfaces/book.res.interface';
import { UserAddrsRes } from '../../usersdb/interfaces/user-addresses.res.interface';

export interface BorrowFiltered {
    _id: Types.ObjectId;
    user?: UserFiltered;
    book: BookRes;
    address: UserAddrsRes;
    requestedAt: number;
    approvedAt?: number;
    rejectedAt?: number;
    rejectReason?: string;
    returnedAt?: number;
}
