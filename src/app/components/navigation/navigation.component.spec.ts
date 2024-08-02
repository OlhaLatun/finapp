import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { NavigationComponent } from './navigation.component';
import { UserService } from '../../services/user.service';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;
    let userServiceMock: any;
    let dialogMock: any;

    beforeEach(async () => {
        userServiceMock = {
            getCurrentUserObservable: jasmine
                .createSpy('getCurrentUserObservable')
                .and.returnValue(of({})),
        };

        dialogMock = {
            open: jasmine.createSpy('open'),
        };

        await TestBed.configureTestingModule({
            declarations: [NavigationComponent],
            imports: [MatMenuModule],
            providers: [
                { provide: UserService, useValue: userServiceMock },
                { provide: MatDialog, useValue: dialogMock },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set current user', () => {
        expect(component.currentUser$).toBeDefined();
    });

    it('should trigger logout event', () => {
        spyOn(component.onLogout, 'emit');

        component.logout();

        expect(component.onLogout.emit).toHaveBeenCalled();
    });

    it('should open settings dialog', () => {
        component.showSettingsDialog();
        expect(dialogMock.open).toHaveBeenCalledWith(SettingsDialogComponent, {
            height: '535px',
            width: '600px',
            panelClass: 'my-dialog',
        });
    });
});
