import { Types } from 'mongoose';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { BookRes } from '../../booksdb/interfaces/book.res.interface';

export interface ReturnFiltered {
    _id: Types.ObjectId;
    user?: UserFiltered;
    book: BookRes;
    borrowId: Types.ObjectId;
    borrowedAt: number;
    requestedAt: number;
    approvedAt?: number;
    rejectedAt?: number;
}
