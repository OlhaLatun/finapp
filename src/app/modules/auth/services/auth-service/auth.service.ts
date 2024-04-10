import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { AuthApiService } from '../auth-api-service/auth.api.service';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly authApiService: AuthApiService,
        private readonly userService: UserService,
    ) {}

    public registerNewUser(credentials: UserCredentials): Observable<User> {
        return this.authApiService
            .registerNewUser(credentials)
            .pipe(switchMap(() => this.loginUser(credentials)));
    }

    public loginUser(credentials: UserCredentials): Observable<User> {
        return this.authApiService.loginUser(credentials).pipe(
            tap((response) => {
                this.userService.setCurrentUser(response);
                this.localStorageService.setItem(
                    'user-token',
                    response['user-token'],
                );
                this.localStorageService.setItem('objectId', response.objectId);
            }),
        );
    }
}
