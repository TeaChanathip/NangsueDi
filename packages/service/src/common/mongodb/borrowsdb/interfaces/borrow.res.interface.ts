import { Types } from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';
import { UsersAddressesModel } from '../../usersdb/schemas/users-addresses.schema';

export interface BorrowRes {
    _id: Types.ObjectId;
    userId: UsersModel;
    bookId: BooksModel;
    addrId: UsersAddressesModel;
    requestedAt: number;
    approvedAt?: number;
    rejectedAt?: number;
    returnedAt?: number;
}
