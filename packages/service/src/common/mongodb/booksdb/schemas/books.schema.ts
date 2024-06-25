import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MAX_NAME, MAX_TEXT, MAX_TITLE } from 'src/shared/consts/length.const';

@Schema({
    collection: 'Books',
    autoCreate: true,
    versionKey: false,
})
export class BooksModel {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: false })
    author?: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    publishedAt: number;

    @Prop({ required: true })
    registeredAt: number;

    @Prop({ required: true })
    totalNumber: number;

    @Prop({ required: true })
    remainNumber: number;

    // sorted array of genre numbers
    @Prop({ required: false })
    genres?: number[];

    // @Prop({required: false})
    // borrowId?:
}

export const BooksSchema = SchemaFactory.createForClass(BooksModel);
