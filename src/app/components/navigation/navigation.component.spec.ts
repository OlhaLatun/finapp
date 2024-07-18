import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NavigationComponent],
            providers: [
                {
                    provide: MatDialog,
                    useValue: jasmine.createSpyObj('MatDialog', ['closeAll']),
                },
                {
                    provide: UserService,
                    useValue: jasmine.createSpyObj('UserService', [
                        'setCurrentUser',
                        'getCurrentUserObservable',
                    ]),
                },
            ],
        });
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
