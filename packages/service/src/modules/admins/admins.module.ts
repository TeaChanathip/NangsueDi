import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { UsersDBModule } from '../../common/mongodb/usersdb/users.db.module';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';
import { BorrowsDBModule } from 'src/common/mongodb/borrowsdb/borrowsdb.module';
import { ReturnsDBModule } from 'src/common/mongodb/returnsdb/returnsdb.module';

@Module({
    imports: [UsersDBModule, BooksDBModule, BorrowsDBModule, ReturnsDBModule],
    providers: [AdminsService],
    controllers: [AdminsController],
})
export class AdminsModule {}
