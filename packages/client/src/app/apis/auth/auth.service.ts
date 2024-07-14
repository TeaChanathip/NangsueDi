import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRes } from './interfaces/login-response.interface';
import { User } from '../../shared/interfaces/user.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	serviceUrl = `${environment.SERVICE_URL}/auth`;

	constructor(private readonly httpClient: HttpClient) {}

	login(credentials: {
		email: string;
		password: string;
	}): Observable<HttpResponse<LoginRes>> {
		return this.httpClient.post<LoginRes>(
			`${this.serviceUrl}/login`,
			credentials,
			{
				observe: 'response',
			},
		);
	}

	register(registerData: {
		email: string;
		phone: string;
		password: string;
		firstName: string;
		lastName?: string;
		birthTime: number; // converted to unix time
	}): Observable<HttpResponse<User>> {
		return this.httpClient.post<User>(
			`${this.serviceUrl}/register`,
			registerData,
			{ observe: 'response' },
		);
	}
}
