import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Borrow } from '../../shared/interfaces/borrow.model';

@Injectable({
	providedIn: 'root',
})
export class ManagerService {
	url = `${environment.SERVICE_URL}/managers`;

	constructor(private readonly apiService: ApiService) {}

	getBorrows(props: {
		bookKeyword?: string;
		isApproved?: number;
		isReturned?: number;
		limit?: number;
		page?: number;
	}): Observable<HttpResponse<Borrow[]>> {
		const { bookKeyword, isApproved, isReturned, limit, page } = props;

		const params = new HttpParams({
			fromObject: {
				...(bookKeyword && { bookKeyword }),
				...(isApproved !== undefined && { isApproved }),
				...(isReturned !== undefined && { isReturned }),
				...(limit !== undefined && { limit }),
				...(page !== undefined && { page }),
			},
		});

		return this.apiService.get<Borrow[]>(`${this.url}/get-borrows`, params);
	}
}
