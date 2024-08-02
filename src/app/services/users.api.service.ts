import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    constructor(private readonly http: HttpClient) {}
    public getUserById(objectId: string): Observable<User> {
        return this.http
            .get<User>(
                `https://ferventselection.backendless.app/api/data/Users/${objectId}`,
            )
            .pipe(map((user) => new User(user)));
    }
}
