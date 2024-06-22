import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';
import { UsersPermissionsModel } from './users-permissions.schema';

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

    @Prop({ required: true, enum: Role })
    role: Role;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersPermissions',
        required: false,
    })
    permissions?: UsersPermissionsModel;

    @Prop({ required: true, immutable: true })
    registeredAt: number;

    @Prop({ required: false })
    updatedAt: number;

    @Prop({ required: true })
    tokenVersion: number;
}

export const UsersSchema = SchemaFactory.createForClass(UsersModel);
