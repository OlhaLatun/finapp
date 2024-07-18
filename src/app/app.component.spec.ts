import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth-service/auth.service';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';
import { UserService } from './services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            providers: [
                AuthService,
                AuthApiService,
                HttpClient,
                HttpHandler,
                {
                    provide: UserService,
                    useValue: jasmine.createSpyObj('UserService', [
                        'setCurrentUser',
                        'getUserToken',
                        'getUserID',
                    ]),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }),
    );

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'Finance Manager'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('Finance Manager');
    });
});
