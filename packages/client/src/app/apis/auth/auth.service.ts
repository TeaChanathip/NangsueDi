import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/interfaces/user.model';
import { LoginRes } from './interfaces/login-response.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	serviceUrl = `${environment.SERVICE_URL}/auth/login`;

	constructor(private readonly httpClient: HttpClient) {}

	login(credentials: {
		email: string;
		password: string;
	}): Observable<HttpResponse<LoginRes>> {
		return this.httpClient.post<LoginRes>(this.serviceUrl, credentials, {
			observe: 'response',
		});
	}
}
