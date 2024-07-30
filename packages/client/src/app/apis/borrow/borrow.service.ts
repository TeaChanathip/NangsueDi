import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Borrow } from '../../shared/interfaces/borrow.model';

@Injectable({
	providedIn: 'root',
})
export class BorrowService {
	private url = `${environment.SERVICE_URL}/actions/borrows`;

	constructor(private readonly apiService: ApiService) {}

	getNonReturned(
		limit?: number,
		page?: number,
	): Observable<HttpResponse<Borrow[]>> {
		const params = new HttpParams({
			fromObject: {
				...(limit && { limit }),
				...(page && { page }),
			},
		});

		return this.apiService.get<Borrow[]>(
			`${this.url}/non-returned`,
			params,
		);
	}

	borrowBook(
		bookId: string,
		addrId: string,
	): Observable<HttpResponse<Borrow>> {
		const body = {
			addrId,
		};

		return this.apiService.post<typeof body, Borrow>(
			`${this.url}/${bookId}`,
			body,
		);
	}
}
