import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UsersModel } from './users.schema';

@Schema({
    collection: 'UserPermissions',
    autoCreate: true,
    versionKey: false,
})
export class UserPermissionsModel {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    })
    userId: UsersModel;

    @Prop({ required: true })
    canBorrow: boolean;

    @Prop({ required: true })
    canReview: boolean;
}

export const UserPermissionsSchema =
    SchemaFactory.createForClass(UserPermissionsModel);
