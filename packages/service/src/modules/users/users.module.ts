import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersCollectionModule } from 'src/common/mongodb/users-collection/users-collection.module';

@Module({
    imports: [UsersCollectionModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
