import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private baseUrl = 'https://lovelyspider.backendless.app';
    constructor(private readonly http: HttpClient) {}

    public registerNewUser(user: User): Observable<any> {
        console.log(this.baseUrl);
        return this.http.post<any>(`${this.baseUrl}/api/users/register`, user);
    }
}
