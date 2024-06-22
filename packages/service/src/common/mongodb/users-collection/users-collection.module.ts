import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersCollectionService } from './users-collection.service';
import { UsersModel, UsersSchema } from './schemas/users.schema';
import {
    UsersPermissionsModel,
    UsersPermissionsSchema,
} from './schemas/users-permissions.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UsersModel.name, schema: UsersSchema },
            {
                name: UsersPermissionsModel.name,
                schema: UsersPermissionsSchema,
            },
        ]),
    ],
    providers: [UsersCollectionService],
    exports: [UsersCollectionService],
})
export class UsersCollectionModule {}
