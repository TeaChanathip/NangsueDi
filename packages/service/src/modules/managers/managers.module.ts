import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { BorrowsDBModule } from '../../common/mongodb/borrowsdb/borrowsdb.module';
import { ReturnsDBModule } from '../../common/mongodb/returnsdb/returnsdb.module';
import { BooksDBModule } from '../../common/mongodb/booksdb/booksdb.module';

@Module({
    imports: [BorrowsDBModule, ReturnsDBModule, BooksDBModule],
    controllers: [ManagersController],
    providers: [ManagersService],
})
export class ManagersModule {}
