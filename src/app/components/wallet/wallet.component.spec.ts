import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponent } from './wallet.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('WalletComponent', () => {
    let component: WalletComponent;
    let fixture: ComponentFixture<WalletComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [WalletComponent],
            providers: [
                {
                    provide: DialogRef,
                    useValue: jasmine.createSpyObj('DialogRef', ['close']),
                },
                {
                    provide: MatDialog,
                    useValue: jasmine.createSpyObj('MatDialog', ['closeAll']),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(WalletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
