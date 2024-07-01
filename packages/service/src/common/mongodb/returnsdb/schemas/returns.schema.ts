import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BorrowsModel } from '../../borrowsdb/schemas/borrows.schema';

@Schema({
    collection: 'Returns',
    autoCreate: true,
    versionKey: false,
})
export class ReturnsModel {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Borrows',
        required: true,
    })
    borrowId: BorrowsModel;

    @Prop({ type: Number, required: true })
    requestedAt: number;

    @Prop({ type: Number, required: false })
    approvedAt?: number;
}

export const ReturnsSchema = SchemaFactory.createForClass(ReturnsModel);
