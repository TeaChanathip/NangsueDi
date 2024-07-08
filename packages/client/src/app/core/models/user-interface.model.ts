import { Role } from '../../shared/enums/role.enum';

export interface UserModel {
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
