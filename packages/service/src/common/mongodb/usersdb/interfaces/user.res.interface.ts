import { Types } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';

export interface UserRes {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    addresses: string[];
    password: string;
    firstName: string;
    lastName?: string;
    birthDate: number;
    avartarUrl?: string;
    role: Role;
    permissions?: UsersPermissionsModel;
    registeredAt: number;
    updatedAt?: number;
    suspendedAt?: number;
    tokenVersion: number;
}
