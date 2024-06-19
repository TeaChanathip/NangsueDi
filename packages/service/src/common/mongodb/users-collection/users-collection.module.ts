import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersCollectionService } from './users-collection.service';
import { UsersModel, UsersSchema } from './schemas/users.schema';
import {
    UserPermissionsModel,
    UserPermissionsSchema,
} from './schemas/user-permissions.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UsersModel.name, schema: UsersSchema },
            { name: UserPermissionsModel.name, schema: UserPermissionsSchema },
        ]),
    ],
    providers: [UsersCollectionService],
    exports: [UsersCollectionService],
})
export class UsersCollectionModule {}
