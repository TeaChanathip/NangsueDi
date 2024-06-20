import { Types } from 'mongoose';
import { Roles } from '../enums/roles.enum';
import { UserPermissionsModel } from 'src/common/mongodb/users-collection/schemas/user-permissions.schema';

export interface User {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName?: string;
    avartarUrl?: string;
    role: Roles;
    permissions?: UserPermissionsModel;
}
