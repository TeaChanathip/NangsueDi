import { ObjectId } from 'mongoose';
import { Roles } from '../enums/roles.enum';

export interface User {
    _id: ObjectId;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName?: string;
    avartarUrl?: string;
    role: Roles;
    permissions?: ObjectId;
}
