import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { map, Observable, of, skipWhile } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
    ) {}
    canActivate(): Observable<boolean> {
        return this.userService.getCurrentUserObservable().pipe(
            skipWhile((user) => !user),
            map((user) => {
                if (user) {
                    this.router.navigate(['wallet']);
                    return false;
                } else {
                    return true;
                }
            }),
        );
    }
}
