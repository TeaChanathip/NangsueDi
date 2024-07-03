import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';
import { UsersAddressesModel } from '../../usersdb/schemas/users-addresses.schema';

@Schema({
    collection: 'Borrows',
    autoCreate: true,
    versionKey: false,
})
export class BorrowsModel {
    _id: Types.ObjectId;

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

    @Prop({ type: Number, required: false })
    rejectedAt?: number;

    @Prop({ type: String, required: false })
    rejectReason?: string;

    @Prop({ type: Number, required: false })
    returnedAt?: number;
}

export const BorrowsSchema = SchemaFactory.createForClass(BorrowsModel).index(
    { userId: 1, bookId: 1, requestedAt: 1 },
    { unique: true },
);
