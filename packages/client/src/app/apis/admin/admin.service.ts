import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Role } from '../../shared/enums/role.enum';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { User } from '../../shared/interfaces/user.model';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	private url: string = `${environment.SERVICE_URL}/admins`;

	constructor(private readonly apiService: ApiService) {}

	searchUsers(props: {
		email?: string;
		phone?: string;
		firstName?: string;
		lastName?: string;
		roles?: Role[];
		isVerified?: number;
		isSuspended?: number;
		limit: number;
		page: number;
	}): Observable<HttpResponse<User[]>> {
		const {
			email,
			phone,
			firstName,
			lastName,
			roles,
			isVerified,
			isSuspended,
			limit,
			page,
		} = props;

		const queryParams = new HttpParams({
			fromObject: {
				...(email && { email }),
				...(phone && { phone }),
				...(firstName && { firstName }),
				...(lastName && { lastName }),
				...(roles && { roles }),
				...(isVerified !== undefined && { isVerified }),
				...(isSuspended !== undefined && { isSuspended }),
				...(limit && { limit }),
				...(page && { page }),
			},
		});

		return this.apiService.get<User[]>(
			`${this.url}/search-users`,
			queryParams,
		);
	}

	verifyUser(userId: string): Observable<HttpResponse<User>> {
		return this.apiService.patch<unknown, User>(
			`${this.url}/verify-user/${userId}`,
		);
	}

	deleteUser(userId: string): Observable<HttpResponse<User>> {
		return this.apiService.delete<User>(
			`${this.url}/delete-user/${userId}`,
		);
	}

	suspendUser(userId: string): Observable<HttpResponse<User>> {
		return this.apiService.patch<unknown, User>(
			`${this.url}/suspend-user/${userId}`,
		);
	}

	unsuspendUser(userId: string): Observable<HttpResponse<User>> {
		return this.apiService.patch<unknown, User>(
			`${this.url}/unsuspend-user/${userId}`,
		);
	}

	getNumberOfUsers(): Observable<HttpResponse<number>> {
		return this.apiService.get<number>(`${this.url}/get-number-of-users`);
	}

	getNumberOfBooks(): Observable<HttpResponse<number>> {
		return this.apiService.get<number>(`${this.url}/get-number-of-books`);
	}

	getNumberOfBorrows(): Observable<HttpResponse<number>> {
		return this.apiService.get<number>(`${this.url}/get-number-of-borrows`);
	}

	getNumberOfReturns(): Observable<HttpResponse<number>> {
		return this.apiService.get<number>(`${this.url}/get-number-of-returns`);
	}
}
