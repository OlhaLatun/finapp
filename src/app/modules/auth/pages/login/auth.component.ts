import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuthApiService } from '../../../../services/auth-api-service/auth.api.service';
import { User } from '../../../../interfaces/user.interface';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    public currentPath = this.route.snapshot.url[0].path;
    public form: UntypedFormGroup = new FormGroup<any>({
        email: new FormControl(''),
        password: new FormControl(''),
    });
    constructor(
        private readonly route: ActivatedRoute,
        private readonly auth: AuthApiService,
    ) {}

    onSubmit(): void {
        console.log(this.form);
        if (this.form.valid)
            this.auth
                .registerNewUser({
                    email: this.form.get('email')?.value,
                    password: this.form.get('password')?.value,
                })
                .subscribe((response) => {
                    console.log(response);
                });
    }
}
