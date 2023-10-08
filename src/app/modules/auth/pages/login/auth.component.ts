import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api-service/auth.api.service';

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
        private readonly auth: AuthApiService,
    ) {}

    onSubmit(): void {
        if (this.form.valid) {
            const credentials = {
                login: this.form.get('email')?.value,
                password: this.form.get('password')?.value,
            };
            if (this.currentPath === 'signup') {
                this.auth.registerNewUser(credentials).subscribe((response) => {
                    console.log(response);
                });
            } else {
                this.auth.loginUser(credentials).subscribe((user) => {
                    console.log(user['user-token']);
                });
            }
        }
    }
}
