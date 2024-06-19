import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    collection: 'UserPermissions',
    autoCreate: true,
    versionKey: false,
})
export class UserPermissionsModel {
    @Prop({ required: false })
    canBorrow?: boolean;

    @Prop({ required: false })
    canReview?: boolean;
}

export const UserPermissionsSchema =
    SchemaFactory.createForClass(UserPermissionsModel);
