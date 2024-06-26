import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';

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

    @Prop({ type: Number, required: true })
    timestamp: number;

    @Prop({ type: Number, required: true })
    amount: number;
}

export const BorrowsSchema = SchemaFactory.createForClass(BorrowsModel).index(
    { userId: 1, bookId: 1, timestamp: 1 },
    { unique: true },
);
