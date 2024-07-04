import { Module } from '@nestjs/common';
import { ActionsBorrowsController } from './controllers/actions.borrows.controller';
import { ActionsBorrowsService } from './services/actions.borrows.service';
import { BorrowsDBModule } from '../../common/mongodb/borrowsdb/borrowsdb.module';
import { UsersDBModule } from '../../common/mongodb/usersdb/users.db.module';
import { BooksDBModule } from '../../common/mongodb/booksdb/booksdb.module';
import { ActionsReturnsController } from './controllers/actions.returns.controller';
import { ActionsReturnsService } from './services/actions.returns.service';
import { ReturnsDBModule } from '../../common/mongodb/returnsdb/returnsdb.module';

@Module({
    imports: [BorrowsDBModule, UsersDBModule, BooksDBModule, ReturnsDBModule],
    providers: [ActionsBorrowsService, ActionsReturnsService],
    controllers: [ActionsBorrowsController, ActionsReturnsController],
})
export class ActionsModule {}
