import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

export interface UserFiltered {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    addresses: string[];
    firstName: string;
    lastName?: string;
    birthDate: number;
    avartarUrl?: string;
    role: Role;
    permissions?: {
        canBorrow: boolean;
        canReview: boolean;
    };
    registeredAt: number;
    updatedAt?: number;
    suspendedAt?: number;
}
