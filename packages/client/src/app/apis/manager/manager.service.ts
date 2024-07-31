import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Borrow } from '../../shared/interfaces/borrow.model';
import { Return } from '../../shared/interfaces/return.model';

@Injectable({
	providedIn: 'root',
})
export class ManagerService {
	url = `${environment.SERVICE_URL}/managers`;

	constructor(private readonly apiService: ApiService) {}

	getBorrows(props: {
		bookKeyword?: string;
		isApproved?: number;
		isRejected?: number;
		isReturned?: number;
		limit?: number;
		page?: number;
	}): Observable<HttpResponse<Borrow[]>> {
		const { bookKeyword, isApproved, isRejected, isReturned, limit, page } =
			props;

		const params = new HttpParams({
			fromObject: {
				...(bookKeyword && { bookKeyword }),
				...(isApproved !== undefined && { isApproved }),
				...(isRejected !== undefined && { isRejected }),
				...(isReturned !== undefined && { isReturned }),
				...(limit !== undefined && { limit }),
				...(page !== undefined && { page }),
			},
		});

		return this.apiService.get<Borrow[]>(`${this.url}/get-borrows`, params);
	}

	approveBorrow(borrowId: string): Observable<HttpResponse<Borrow>> {
		return this.apiService.patch<unknown, Borrow>(
			`${this.url}/approve-borrow/${borrowId}`,
		);
	}

	rejectBorrow(
		borrowId: string,
		rejectReason: string,
	): Observable<HttpResponse<Borrow>> {
		const body = {
			rejectReason,
		};
		return this.apiService.patch<typeof body, Borrow>(
			`${this.url}/reject-borrow/${borrowId}`,
			body,
		);
	}

	getReturns(props: {
		bookKeyword?: string;
		borrowIdQuery?: string;
		isApproved?: number;
		isRejected?: number;
		limit?: number;
		page?: number;
	}): Observable<HttpResponse<Return[]>> {
		const {
			bookKeyword,
			borrowIdQuery,
			isApproved,
			isRejected,
			limit,
			page,
		} = props;

		const params = new HttpParams({
			fromObject: {
				...(bookKeyword && { bookKeyword }),
				...(borrowIdQuery && { borrowIdQuery }),
				...(isApproved !== undefined && { isApproved }),
				...(isRejected !== undefined && { isRejected }),
				...(limit !== undefined && { limit }),
				...(page !== undefined && { page }),
			},
		});

		return this.apiService.get<Return[]>(`${this.url}/get-returns`, params);
	}

	approveReturn(returnId: string): Observable<HttpResponse<Return>> {
		return this.apiService.patch<unknown, Return>(
			`${this.url}/approve-return/${returnId}`,
		);
	}

	rejectReturn(
		returnId: string,
		rejectReason: string = 'test',
	): Observable<HttpResponse<Return>> {
		const params = {
			rejectReason,
		};

		return this.apiService.patch<typeof params, Return>(
			`${this.url}/reject-return/${returnId}`,
			params,
		);
	}
}
