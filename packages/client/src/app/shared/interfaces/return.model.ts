import { Book } from './book.model';
import { User } from './user.model';

export interface Return {
	_id: string;
	user?: User;
	book: Book;
	borrowId: string;
	borrowedAt: number;
	requestedAt: number;
	approvedAt?: number;
	rejectedAt?: number;
	rejectReason?: string;
}
