import { Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { BorrowsDBModule } from 'src/common/mongodb/borrowsdb/borrowsdb.module';
import { UsersDBModule } from 'src/common/mongodb/usersdb/users.db.module';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';

@Module({
    imports: [UsersDBModule, BooksDBModule, BorrowsDBModule],
    providers: [BorrowsService],
    controllers: [BorrowsController],
})
export class BorrowsModule {}
