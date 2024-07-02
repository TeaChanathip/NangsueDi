import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { BorrowsDBModule } from 'src/common/mongodb/borrowsdb/borrowsdb.module';
import { ReturnsDBModule } from 'src/common/mongodb/returnsdb/returnsdb.module';
import { BooksDBModule } from 'src/common/mongodb/booksdb/booksdb.module';

@Module({
    imports: [BorrowsDBModule, ReturnsDBModule, BooksDBModule],
    controllers: [ManagersController],
    providers: [ManagersService],
})
export class ManagersModule {}
