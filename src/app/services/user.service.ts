import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UsersApiService } from './users.api.service';

@Injectable()
export class UserService {
    private readonly user = new BehaviorSubject<User | null>(null);

    constructor(private readonly usersApiService: UsersApiService) {}
    public setCurrentUser(user: any): void {
        this.user.next(user);
    }

    public getCurrentUserObservable(): Observable<User | null> {
        return this.user.asObservable();
    }

    getUserById(objectId: string): Observable<User> {
        return this.usersApiService.getUserById(objectId);
    }
}
