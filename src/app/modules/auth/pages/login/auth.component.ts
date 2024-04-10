import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { User } from '../../../../models/user.model';
import { SettingsDialogComponent } from '../../../../components/settings-dialog/settings-dialog.component';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    public currentPath = this.activatedRoute.snapshot.url.length
        ? this.activatedRoute.snapshot.url[0].path
        : '';

    public form: UntypedFormGroup = new FormGroup<any>({
        email: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly authService: AuthService,
    ) {}

    public onSubmit(): void {
        if (this.form.valid) {
            const credentials: UserCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value,
            };

            this.getAuthObservable(credentials).subscribe({
                next: () => {
                    this.router.navigate(['/wallet']);
                    this.dialog.open(SettingsDialogComponent);
                },
                error: (error) => console.log(error),
            });
        }
    }

    private getAuthObservable(credentials: UserCredentials): Observable<User> {
        return this.currentPath === 'signup'
            ? this.authService.registerNewUser(credentials)
            : this.authService.loginUser(credentials);
    }
}
