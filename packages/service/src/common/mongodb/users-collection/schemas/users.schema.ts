import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Roles } from 'src/shared/enums/roles.enum';
import { UserPermissionsModel } from './user-permissions.schema';

@Schema({
    collection: 'Users',
    autoCreate: true,
    versionKey: false,
})
export class UsersModel {
    @Prop({ required: true, unique: true, immutable: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: false })
    lastName?: string;

    @Prop({ required: false, trim: true })
    avartarUrl?: string;

    @Prop({ required: true, enum: Roles })
    role: Roles;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPermission',
        required: false,
    })
    permissions?: UserPermissionsModel;

    @Prop({ required: true, immutable: true })
    registeredAt: number;

    @Prop({ required: false })
    updatedAt: number;

    @Prop({ required: true })
    tokenVersion: number;
}

export const UsersSchema = SchemaFactory.createForClass(UsersModel);
