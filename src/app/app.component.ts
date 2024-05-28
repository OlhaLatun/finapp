import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { UserService } from './services/user.service';
import { LocalStorageKeys } from './enums/local-storage-keys.enum';
import { AuthService } from './modules/auth/services/auth-service/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Finance Manager';

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly localStorage: LocalStorageService,
        private readonly userService: UserService,
    ) {}

    public ngOnInit(): void {
        const userToken = this.userService.getUserToken();
        if (userToken) {
            this.authService
                .checkSessionValidity(userToken)
                .subscribe((isSessionValid) => {
                    if (!isSessionValid) {
                        this.localStorage.removeItem(
                            LocalStorageKeys.UserToken,
                        );
                        this.localStorage.removeItem(LocalStorageKeys.UserId);
                    }
                });
        }

        if (this.userService.getUserID()) {
            this.userService.getUserById().subscribe((user) => {
                this.userService.setCurrentUser(user);
            });
        }
    }

    public logout(): void {
        const userToken = this.userService.getUserToken();

        if (!userToken) {
            return;
        }

        this.authService.logout(userToken).subscribe(() => {
            this.userService.setCurrentUser(null);
            this.localStorage.removeItem(LocalStorageKeys.UserToken);
            this.localStorage.removeItem(LocalStorageKeys.UserId);
            this.router.navigate(['/login']);
        });
    }
}
