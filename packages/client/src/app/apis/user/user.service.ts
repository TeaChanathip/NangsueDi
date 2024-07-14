import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user.model';
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private url = `${environment.SERVICE_URL}/users`;

	constructor(private readonly apiService: ApiService) {}

	getUser(): Observable<HttpResponse<User>> {
		return this.apiService.get<User>(`${this.url}/profile`);
	}
}
