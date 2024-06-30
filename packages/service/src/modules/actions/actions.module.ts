import { Module } from '@nestjs/common';
import { ActionsBorrowsController } from './controllers/actions.borrows.controller';
import { ActionsBorrowsService } from './services/actions.borrows.service';
import { BorrowsDBModule } from 'src/common/mongodb/borrowsdb/borrowsdb.module';
import { UsersDBModule } from 'src/common/mongodb/usersdb/users.db.module';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';

@Module({
    imports: [BorrowsDBModule, UsersDBModule, BooksDBModule],
    providers: [ActionsBorrowsService],
    controllers: [ActionsBorrowsController],
})
export class ActionsModule {}
