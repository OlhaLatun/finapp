import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UsersApiService } from './users.api.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class UserService {
    private readonly user = new BehaviorSubject<User | null>(null);

    constructor(
        private readonly usersApiService: UsersApiService,
        private readonly localStorageService: LocalStorageService,
    ) {}
    public setCurrentUser(user: User | null): void {
        this.user.next(user);
    }

    public getCurrentUserObservable(): Observable<User | null> {
        return this.user.asObservable();
    }

    public getUserById(): Observable<User> {
        const userId = this.getUserID();
        return this.usersApiService.getUserById(userId);
    }

    public getUserToken(): string {
        return this.localStorageService.getItem('user-token') || '';
    }

    public getUserID(): string {
        return this.localStorageService.getItem('objectId') || '';
    }
}
