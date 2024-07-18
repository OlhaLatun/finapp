import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from './auth.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../../services/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('AuthComponent', () => {
    let component: AuthComponent;
    let fixture: ComponentFixture<AuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ReactiveFormsModule],
            declarations: [AuthComponent],
            providers: [
                HttpClient,
                HttpHandler,
                {
                    provide: UserService,
                    useValue: jasmine.createSpyObj('UserService', [
                        'setCurrentUser',
                    ]),
                },
                {
                    provide: MatDialogRef,
                    useValue: jasmine.createSpyObj('MatDialogRef', ['close']),
                },
                {
                    provide: MatDialog,
                    useValue: jasmine.createSpyObj('MatDialog', ['closeAll']),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(AuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
