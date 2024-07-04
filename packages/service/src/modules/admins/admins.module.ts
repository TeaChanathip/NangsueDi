import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { UsersDBModule } from '../../common/mongodb/usersdb/users.db.module';

@Module({
    imports: [UsersDBModule],
    providers: [AdminsService],
    controllers: [AdminsController],
})
export class AdminsModule {}
