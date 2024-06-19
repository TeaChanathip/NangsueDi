import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
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
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
