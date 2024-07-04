import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksDBModule } from '../../common/mongodb/booksdb/booksdb.module';
import { BorrowsDBModule } from '../../common/mongodb/borrowsdb/borrowsdb.module';

@Module({
    imports: [BooksDBModule, BorrowsDBModule],
    providers: [BooksService],
    controllers: [BooksController],
})
export class BooksModule {}
