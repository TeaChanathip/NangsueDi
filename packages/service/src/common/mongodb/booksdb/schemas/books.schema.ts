import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    collection: 'Books',
    autoCreate: true,
    versionKey: false,
})
export class BooksModel {}

export const BooksSchema = SchemaFactory.createForClass(BooksModel);
