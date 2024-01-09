import {  Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Finance Manager';
    public userName: string | undefined;
    private userToken: string;

    constructor(private readonly userService: UserService,
                private readonly authService: AuthApiService,
                private readonly router: Router) {
    }

    public ngOnInit(): void {
      this.userService.getCurrentUserObservable().subscribe((user: Partial<User>) => {
       if (user.email || user.name) {
         this.userName = user?.email || user?.name
       }
       if (user) {
         this.userToken = user['user-token'] || ''
       }
      })
    }

  public logout(): void {
      this.authService.logout(this.userToken).subscribe(() => {
       this.userName = '';
       this.router.navigate(['/login'])
      })
    }
}
