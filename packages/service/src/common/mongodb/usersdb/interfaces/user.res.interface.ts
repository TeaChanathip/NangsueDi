import { Types } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';

export interface UserRes {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName?: string;
    avartarUrl?: string;
    role: Role;
    permissions?: UsersPermissionsModel;
    registeredAt: number;
    updatedAt?: number;
    suspendedAt?: number;
    tokenVersion: number;
}
