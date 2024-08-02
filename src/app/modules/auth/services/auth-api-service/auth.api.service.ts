import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { User } from '../../../../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private baseUrl = 'https://wholebite-us.backendless.app';
    constructor(private readonly http: HttpClient) {}

    public registerNewUser(credentials: UserCredentials): Observable<User> {
        return this.http.post<User>(
            `${this.baseUrl}/api/users/register`,
            credentials,
        );
    }

    public loginUser(credentials: UserCredentials): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/api/users/login`, {
            login: credentials.email,
            password: credentials.password,
        });
    }

    public logout(userToken: string): Observable<any> {
        return this.http.get(this.baseUrl + '/api/users/logout', {
            headers: { 'user-token': userToken },
        });
    }

    public checkSessionValidity(userToken: string): Observable<any> {
        return this.http.get(
            this.baseUrl + `/api/users/isvalidusertoken/${userToken}`,
        );
    }
}
