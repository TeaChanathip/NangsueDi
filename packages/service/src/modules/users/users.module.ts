import { Module } from '@nestjs/common';
import { UsersProfilesService } from './services/users.profiles.service';
import { UsersProfilesController } from './controllers/users.profiles.controller';
import { UsersDBModule } from '../../common/mongodb/usersdb/users.db.module';
import { BorrowsDBModule } from '../../common/mongodb/borrowsdb/borrowsdb.module';
import { UsersAddrsService } from './services/users.addresses.service';
import { UsersAddrsController } from './controllers/users.addresses.controller';

@Module({
    imports: [UsersDBModule, BorrowsDBModule],
    providers: [UsersProfilesService, UsersAddrsService],
    controllers: [UsersProfilesController, UsersAddrsController],
})
export class UsersModule {}
