import {
	HttpClient,
	HttpHeaders,
	HttpParams,
	HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private readonly httpClient: HttpClient) {}

	headers = new HttpHeaders({
		Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
	});

	get<R>(url: string, params?: HttpParams): Observable<HttpResponse<R>> {
		return this.httpClient.get<R>(url, {
			headers: this.headers,
			observe: 'response',
			params,
		});
	}

	post<T, R>(url: string, body?: T): Observable<HttpResponse<R>> {
		return this.httpClient.post<R>(url, body, {
			headers: this.headers,
			observe: 'response',
		});
	}

	patch<T, R>(url: string, body?: T): Observable<HttpResponse<R>> {
		return this.httpClient.patch<R>(url, body, {
			headers: this.headers,
			observe: 'response',
		});
	}

	delete<R>(url: string): Observable<HttpResponse<R>> {
		return this.httpClient.delete<R>(url, {
			headers: this.headers,
			observe: 'response',
		});
	}
}
