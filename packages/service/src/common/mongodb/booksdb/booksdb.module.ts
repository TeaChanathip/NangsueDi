import { Module } from '@nestjs/common';
import { BooksCollService } from './books.collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModel, BooksSchema } from './schemas/books.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BooksModel.name, schema: BooksSchema },
        ]),
    ],
    providers: [BooksCollService],
    exports: [BooksCollService],
})
export class BooksDBModule {}
