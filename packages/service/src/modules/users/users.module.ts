import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersDBModule } from 'src/common/mongodb/usersdb/users.db.module';

@Module({
    imports: [UsersDBModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
