import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentials, User } from '../../../../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private baseUrl = 'https://lovelyspider.backendless.app';
    constructor(private readonly http: HttpClient) {}

    public registerNewUser(credentials: UserCredentials): Observable<void> {
        return this.http.post<void>(
            `${this.baseUrl}/api/users/register`,
            credentials,
        );
    }

    public loginUser(credentials: UserCredentials): Observable<any> {
        console.log(credentials);
        return this.http.post<any>(
            `${this.baseUrl}/api/users/login`,
            credentials,
        );
    }
}
