import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';
import { UserPermissionsModel } from 'src/common/mongodb/users-collection/schemas/user-permissions.schema';

export interface User {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName?: string;
    avartarUrl?: string;
    role: Role;
    permissions?: UserPermissionsModel;
    tokenVersion: number;
}

export interface UserResponse {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    avartarUrl: string;
    role: Role;
}
