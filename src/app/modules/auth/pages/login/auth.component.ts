import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api-service/auth.api.service';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    public currentPath = this.route.snapshot.url.length
        ? this.route.snapshot.url[0].path
        : '';
    public form: UntypedFormGroup = new FormGroup<any>({
        email: new FormControl(''),
        password: new FormControl(''),
    });
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly auth: AuthApiService,
        private readonly userService: UserService
    ) {}

    onSubmit(): void {
        if (this.form.valid) {
            const credentials: UserCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value,
            };
            if (this.currentPath === 'signup') {
                this.auth.registerNewUser(credentials).subscribe((response) => {
                    this.userService.setCurrentUser(response);
                    this.redirectTo('/wallet')
                });
            } else {
                this.auth.loginUser(credentials).subscribe((user) => {
                  this.userService.setCurrentUser(user);
                  this.redirectTo('/wallet')
                });
            }
        }
    }

    private redirectTo(url: string): void {
      this.router.navigate([url]);
    }
}
