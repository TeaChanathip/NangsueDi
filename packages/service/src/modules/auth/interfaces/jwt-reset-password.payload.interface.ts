import { Types } from 'mongoose';

export interface JwtResetPassPayload {
    userId: Types.ObjectId;
    resetTokenVer: number;
}
