import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';
import { BorrowsDBModule } from 'src/common/mongodb/borrowsdb/borrowsdb.module';
import { UsersDBModule } from 'src/common/mongodb/usersdb/users.db.module';

@Module({
    imports: [BooksDBModule, BorrowsDBModule, UsersDBModule],
    providers: [BooksService],
    controllers: [BooksController],
})
export class BooksModule {}
