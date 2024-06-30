import { Types } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';
import { UsersAddressesModel } from '../schemas/users-addresses.schema';

export interface UserRes {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    addresses: UsersAddressesModel[];
    password: string;
    firstName: string;
    lastName?: string;
    birthTime: number;
    avartarUrl?: string;
    role: Role;
    permissions?: UsersPermissionsModel;
    registeredAt: number;
    updatedAt?: number;
    suspendedAt?: number;
    tokenVersion: number;
}
