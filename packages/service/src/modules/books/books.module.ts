import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';

@Module({
    imports: [BooksDBModule],
    providers: [BooksService],
    controllers: [BooksController],
})
export class BooksModule {}
