import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersCollService } from './services/users.collection.service';
import { UsersPermsCollService } from './services/users-permissions.collection.service';
import { UsersModel, UsersSchema } from './schemas/users.schema';
import {
    UsersPermissionsModel,
    UsersPermissionsSchema,
} from './schemas/users-permissions.schema';
import { UsersAddrsCollService } from './services/users-addresses.collection.service';
import {
    UsersAddressesModel,
    UsersAddressesSchema,
} from './schemas/users-addresses.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UsersModel.name, schema: UsersSchema },
            {
                name: UsersPermissionsModel.name,
                schema: UsersPermissionsSchema,
            },
            {
                name: UsersAddressesModel.name,
                schema: UsersAddressesSchema,
            },
        ]),
    ],
    providers: [UsersCollService, UsersPermsCollService, UsersAddrsCollService],
    exports: [UsersCollService, UsersPermsCollService, UsersAddrsCollService],
})
export class UsersDBModule {}
