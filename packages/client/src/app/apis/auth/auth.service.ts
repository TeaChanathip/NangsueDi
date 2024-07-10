import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { UserModel } from '../../shared/interfaces/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	serviceUrl = `${environment.SERVICE_URL}/auth/login`;

	constructor(private readonly httpClient: HttpClient) {}

	login(credentials: {
		email: string;
		password: string;
	}): Observable<HttpResponse<any>> {
		return this.httpClient.post<any>(this.serviceUrl, credentials, {
			observe: 'response',
		});
	}
}
