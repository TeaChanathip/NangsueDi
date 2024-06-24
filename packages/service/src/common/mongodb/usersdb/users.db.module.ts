import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersCollService } from './services/users.collection.service';
import { UsersPermsCollService } from './services/users-permissions.collection.service';
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
    providers: [UsersCollService, UsersPermsCollService],
    exports: [UsersCollService, UsersPermsCollService],
})
export class UsersDBModule {}
