import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UsersModel } from './users.schema';

@Schema({
    collection: 'UsersPermissions',
    autoCreate: true,
    versionKey: false,
})
export class UsersPermissionsModel {
    _id: Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        unique: true,
        immutable: true,
    })
    userId: UsersModel;

    @Prop({ required: true })
    canBorrow: boolean;

    @Prop({ required: true })
    canReview: boolean;
}

export const UsersPermissionsSchema = SchemaFactory.createForClass(
    UsersPermissionsModel,
);
