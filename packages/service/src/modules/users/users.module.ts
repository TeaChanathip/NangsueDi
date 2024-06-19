import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongodbModule } from 'src/common/mongodb/mongodb.module';

@Module({
    imports: [MongodbModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
