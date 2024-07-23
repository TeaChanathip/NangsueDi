import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user.model';
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';
import { UserAddr } from '../../shared/interfaces/user-address.model';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private url = `${environment.SERVICE_URL}/users`;

	constructor(private readonly apiService: ApiService) {}

	getUser(): Observable<HttpResponse<User>> {
		return this.apiService.get<User>(`${this.url}/profile`);
	}

	changePassword(props: {
		password: string;
		newPassword: string;
	}): Observable<HttpResponse<string>> {
		return this.apiService.patch<
			{ password: string; newPassword: string },
			string
		>(`${this.url}/password`, props);
	}

	getUserAddrs(): Observable<HttpResponse<UserAddr[]>> {
		return this.apiService.get<UserAddr[]>(`${this.url}/address`);
	}

	updateProfile(props: {
		phone?: string;
		firstName?: string;
		lastName?: string;
		birthTime?: number;
		avartarUrl?: string;
	}): Observable<HttpResponse<User>> {
		return this.apiService.patch('${this.url}/profile', props);
	}
}
