import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserModel } from '../../shared/interfaces/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	serviceUrl = `${environment.SERVICE_URL}/users`;

	constructor(private readonly httpClient: HttpClient) {}
}
