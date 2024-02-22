import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Finance Manager';

    constructor(
        private readonly authService: AuthApiService,
        private readonly router: Router,
        private readonly localStorage: LocalStorageService,
        private readonly userService: UserService,
    ) {}

    public ngOnInit(): void {
        if (!this.authService.getUserID()) {
            this.router.navigate(['/login']);
        } else {
            this.userService
                .getUserById(this.authService.getUserID())
                .subscribe((user) => {
                    this.userService.setCurrentUser(user);
                });
        }
    }

    public logout(): void {
        const userToken = this.authService.getToken();

        if (!userToken) {
            return;
        }

        this.authService.logout(userToken).subscribe(() => {
            this.userService.setCurrentUser(null);
            this.localStorage.clearStorage();
            this.router.navigate(['/login']);
        });
    }
}
