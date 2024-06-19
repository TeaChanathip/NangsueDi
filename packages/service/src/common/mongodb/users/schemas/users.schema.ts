import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Roles } from 'src/shared/enums/roles.enum';
import { UserPermissionsModel } from './user-permissions.schema';
import { IsNumber } from 'class-validator';

@Schema({
    collection: 'Users',
    autoCreate: true,
    versionKey: false,
})
export class UsersModel {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: false })
    lastName?: string;

    @Prop({ required: false })
    avartarUrl?: string;

    @Prop({ required: true, enum: Roles })
    role: Roles;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPermission',
        required: false,
    })
    permissions?: UserPermissionsModel;

    @Prop({ required: true })
    registeredAt: number;

    @Prop({ required: false })
    updatedAt: number;
}

export const UsersSchema = SchemaFactory.createForClass(UsersModel);
