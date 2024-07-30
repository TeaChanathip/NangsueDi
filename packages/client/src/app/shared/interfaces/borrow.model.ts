import { Book } from './book.model';
import { UserAddr } from './user-address.model';
import { User } from './user.model';

export interface Borrow {
	_id: string;
	user?: User;
	book: Book;
	address: UserAddr;
	requestedAt: number;
	approvedAt?: number;
	rejectedAt?: number;
	rejectReason?: string;
	returnedAt?: number;
}
