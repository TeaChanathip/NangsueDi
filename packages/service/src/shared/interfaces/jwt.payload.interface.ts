import { Types } from 'mongoose';
import { Roles } from '../enums/roles.enum';

export interface JwtPayload {
    sub: Types.ObjectId;
    email: string;
    role: Roles;
    tokenVersion: number;
}
