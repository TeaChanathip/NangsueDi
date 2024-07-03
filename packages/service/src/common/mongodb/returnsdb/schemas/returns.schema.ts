import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BorrowsModel } from '../../borrowsdb/schemas/borrows.schema';
import { UsersModel } from '../../usersdb/schemas/users.schema';
import { BooksModel } from '../../booksdb/schemas/books.schema';

@Schema({
    collection: 'Returns',
    autoCreate: true,
    versionKey: false,
})
export class ReturnsModel {
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
        ref: 'Borrows',
        required: true,
    })
    borrowId: BorrowsModel;

    @Prop({ type: Number, required: true })
    borrowedAt: number;

    @Prop({ type: Number, required: true })
    requestedAt: number;

    @Prop({ type: Number, required: false })
    approvedAt?: number;

    @Prop({ type: Number, required: false })
    rejectedAt?: number;

    @Prop({ type: String, required: false })
    rejectReason?: string;
}

export const ReturnsSchema = SchemaFactory.createForClass(ReturnsModel).index(
    { userId: 1, borrowId: 1, requestedAt: 1 },
    { unique: true },
);
