import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Return } from '../../shared/interfaces/return.model';

@Injectable({
	providedIn: 'root',
})
export class ReturnService {
	url = `${environment.SERVICE_URL}/actions/returns`;

	constructor(private readonly apiService: ApiService) {}

	returnBook(borrowId: string): Observable<HttpResponse<Return>> {
		return this.apiService.post<unknown, Return>(`${this.url}/${borrowId}`);
	}

	getReturns(props: {
		bookKeyword?: string;
		borrowId?: string;
		isApproved?: number;
		isRejected?: number;
		limit?: number;
		page?: number;
	}): Observable<HttpResponse<Return[]>> {
		const { bookKeyword, borrowId, isApproved, isRejected, limit, page } =
			props;

		const params = new HttpParams({
			fromObject: {
				...(bookKeyword && { bookKeyword }),
				...(borrowId && { borrowId }),
				...(isApproved && { isApproved }),
				...(isRejected && { isRejected }),
				...(limit && { limit }),
				...(page && { page }),
			},
		});

		return this.apiService.get<Return[]>(this.url, params);
	}
}
