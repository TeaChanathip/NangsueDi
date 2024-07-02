import { BorrowsModel } from '../../borrowsdb/schemas/borrows.schema';
import { Types } from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';

export interface ReturnRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    bookId: BooksModel;
    borrowId: BorrowsModel;
    borrowedAt: number;
    requestedAt: number;
    approvedAt?: number;
    rejectedAt?: number;
}
