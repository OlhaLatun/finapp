import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
    public title = 'Finance Manager';
    public userName: string | undefined;
    private userToken: string;

    constructor(private readonly userService: UserService, private readonly authService: AuthApiService) {
    }

    public ngOnInit(): void {
      this.userService.getCurrentUserObservable().subscribe((user: Partial<User>) => {
        console.log(user);
       if (user.email || user.name) {
         this.userName = user?.email || user?.name
       }
       if (user) {
         this.userToken = user?.userToken || ''
       }
      })
    }

    public logout(): void {
      this.authService.logout(this.userToken).subscribe(res => {
        console.log(res);
      })
    }

}
