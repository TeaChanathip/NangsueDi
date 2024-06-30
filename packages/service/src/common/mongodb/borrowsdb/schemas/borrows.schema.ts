import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';
import { UsersAddressesModel } from '../../usersdb/schemas/users-addresses.schema';

@Schema({
    collection: 'Borrows',
    autoCreate: true,
    versionKey: false,
})
export class BorrowsModel {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    })
    userId: UsersModel;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books',
        required: true,
    })
    bookId: BooksModel;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersAddresses',
        required: true,
    })
    addrId: UsersAddressesModel;

    @Prop({ type: Number, required: true })
    requestedAt: number;

    @Prop({ type: Number, required: false })
    approvedAt?: number;
}

export const BorrowsSchema = SchemaFactory.createForClass(BorrowsModel).index(
    { userId: 1, bookId: 1 },
    { unique: true },
);
