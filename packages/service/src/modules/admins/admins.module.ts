import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { UsersCollectionModule } from 'src/common/mongodb/users-collection/users-collection.module';

@Module({
    imports: [UsersCollectionModule],
    providers: [AdminsService],
    controllers: [AdminsController],
})
export class AdminsModule {}
