import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Book } from '../../shared/interfaces/book.model';

@Injectable({
	providedIn: 'root',
})
export class BookService {
	private url = `${environment.SERVICE_URL}/books`;

	constructor(private readonly httpClient: HttpClient) {}

	search(searchParams: {
		bookKeyword?: string;
		publishedBegin?: number;
		publishedEnd?: number;
		isAvailable?: boolean;
		genres?: number[];
		limit?: number;
		page?: number;
	}): Observable<HttpResponse<Book[]>> {
		const {
			bookKeyword,
			publishedBegin,
			publishedEnd,
			isAvailable,
			genres,
			limit,
			page,
		} = searchParams;

		const queryParams = new HttpParams({
			fromObject: {
				...(bookKeyword && { bookKeyword }),
				...(publishedBegin && { publishedBegin }),
				...(publishedEnd && { publishedEnd }),
				...(isAvailable && { remainLB: 1 }),
				...(genres && { genres }),
				...(limit && { limit }),
				...(page && { page }),
			},
		});

		return this.httpClient.get<Book[]>(this.url, {
			params: queryParams,
			observe: 'response',
		});
	}
}
