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
		canBorrow?: boolean;
		// canReview?: boolean;
		limit: number;
		page: number;
	}): Observable<HttpResponse<User[]>> {
		const {
			email,
			phone,
			firstName,
			lastName,
			roles,
			canBorrow,
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
				...(canBorrow && { canBorrow }),
				...(limit && { limit }),
				...(page && { page }),
			},
		});

		return this.apiService.get<User[]>(
			`${this.url}/search-users`,
			queryParams,
		);
	}
}
