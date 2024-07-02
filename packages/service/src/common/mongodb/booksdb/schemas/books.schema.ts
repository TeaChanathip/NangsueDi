import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
    collection: 'Books',
    autoCreate: true,
    versionKey: false,
})
export class BooksModel {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: false })
    author?: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    publishedAt?: number;

    @Prop({ required: true })
    registeredAt: number;

    @Prop({ required: false })
    updatedAt: number;

    @Prop({ required: true })
    total: number;

    @Prop({ required: true })
    borrowed: number;

    // sorted array of genre numbers
    @Prop({ required: false })
    genres?: number[];

    @Prop({ required: false })
    coverUrl?: string;
}

export const BooksSchema = SchemaFactory.createForClass(BooksModel);
