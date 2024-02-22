import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api-service/auth.api.service';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { UserService } from '../../../../services/user.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { UsersApiService } from '../../../../services/users.api.service';

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
        private readonly userService: UserService,
        private readonly ls: LocalStorageService,
    ) {}

    public onSubmit(): void {
        if (this.form.valid) {
            this.getAuthObservable(this.currentPath).subscribe((response) => {
                this.userService.setCurrentUser(response);
                this.ls.setItem('user-token', response['user-token']);
                this.ls.setItem('objectId', response.objectId);
                this.router.navigate(['/wallet']);
            });
        }
    }

    private getAuthObservable(authType: string): Observable<User> {
        const credentials: UserCredentials = {
            email: this.form.get('email')?.value,
            password: this.form.get('password')?.value,
        };
        return authType === 'signup'
            ? this.auth.registerNewUser(credentials)
            : this.auth.loginUser(credentials);
    }
}
