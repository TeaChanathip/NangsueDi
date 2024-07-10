import { Role } from '../enums/role.enum';

export interface User {
	_id: string;
	email: string;
	phone: string;
	firstName: string;
	lastName?: string;
	birthTime: number;
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
