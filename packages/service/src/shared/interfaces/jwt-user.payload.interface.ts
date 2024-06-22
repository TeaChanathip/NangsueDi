import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export interface JwtUserPayload {
    sub: Types.ObjectId;
    email: string;
    role: Role;
    tokenVersion: number;
}
