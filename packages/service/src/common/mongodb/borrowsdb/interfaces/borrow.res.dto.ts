import { Types } from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';

export interface BorrowRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    bookId: BooksModel;
    timestamp: number;
}
