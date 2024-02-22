import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    constructor(private readonly http: HttpClient) {}
    public getUserById(objectId: string): Observable<User> {
        return this.http
            .get<User>(
                `https://cherrycreature.backendless.app/api/data/Users/${objectId}`,
            )
            .pipe(map((user) => new User().assign(user)));
    }
}
