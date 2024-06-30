import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';
import { UsersPermissionsModel } from './users-permissions.schema';
import { UsersAddressesModel } from './users-addresses.schema';

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

    @Prop({
        type: Array<mongoose.Schema.Types.ObjectId>,
        ref: 'UsersAddresses',
        required: false,
    })
    addresses?: UsersAddressesModel[];

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: false })
    lastName?: string;

    @Prop({ required: true })
    birthTime: number;

    @Prop({ required: false })
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

    @Prop({ required: false })
    suspendedAt: number;

    @Prop({ required: true })
    tokenVersion: number;
}

export const UsersSchema = SchemaFactory.createForClass(UsersModel);
