import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserCredentials } from '../../../../interfaces/user.interface';
import { User } from '../../../../models/user.model';
import { SettingsDialogComponent } from '../../../../components/settings-dialog/settings-dialog.component';
import { AuthService } from '../../services/auth-service/auth.service';
import { LocalStorageKeys } from '../../../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../../../../services/local-storage.service';

interface AuthFormControls {
    email: FormControl;
    password: FormControl;
}
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    public currentPath = this.activatedRoute.snapshot.url.length
        ? this.activatedRoute.snapshot.url[0].path
        : '';

    public form: FormGroup;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly authService: AuthService,
        private readonly localStorageService: LocalStorageService,
    ) {}

    public ngOnInit(): void {
        if (this.currentPath === 'login') {
            this.form = new FormGroup<AuthFormControls>({
                email: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required]),
            });
        } else {
            this.form = new FormGroup<AuthFormControls>({
                email: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.min(8),
                ]),
            });
        }
    }

    public onSubmit(): void {
        if (this.form.valid) {
            const credentials: UserCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value,
            };

            this.getAuthObservable(credentials).subscribe({
                next: () => {
                    this.router.navigate(['/wallet']);
                    if (
                        !this.localStorageService.getItem(
                            LocalStorageKeys.Settings,
                        )
                    ) {
                        this.dialog.open(SettingsDialogComponent, {
                            height: '535px',
                            width: '600px',
                            panelClass: 'my-dialog',
                        });
                    }
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
