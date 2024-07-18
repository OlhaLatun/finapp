import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDialogComponent } from './settings-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../services/wallet/wallet.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserSettings } from '../../models/user-settings.model';

describe('SettingsDialogComponent', () => {
    let component: SettingsDialogComponent;
    let fixture: ComponentFixture<SettingsDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SettingsDialogComponent>>;
    let localStorageService: LocalStorageService;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatRadioModule,
                BrowserAnimationsModule,
            ],
            declarations: [SettingsDialogComponent],
            providers: [
                LocalStorageService,
                {
                    provide: DialogRef,
                    useValue: dialogRefSpy,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        fixture = TestBed.createComponent(SettingsDialogComponent);
        localStorageService = TestBed.inject(LocalStorageService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set settings', () => {
        expect(component.settings).toBeDefined();
    });

    it('should reset default settings on reset click', () => {
        component.onResetClick();

        expect(component.settingsForm.controls.income.value).toBe(0);
        expect(component.settingsForm.controls.currency.value).toBe('');
        expect(component.settingsForm.controls.creditCard.value).toBe(false);
    });

    it('should save settings to local storage', () => {
        const localStorageGetSpy = spyOn(localStorageService, 'setItem');
        spyOn(localStorageService, 'getItem').and.returnValue('123');

        component.settingsForm.controls.income.setValue('123');
        component.settingsForm.controls.currency.setValue('USD');
        component.settingsForm.controls.creditCard.setValue(false);

        const settings: UserSettings = new UserSettings({
            currency: 'USD',
            income: 123,
            creditCard: false,
        });

        component.onSaveClick();

        expect(localStorageGetSpy).toHaveBeenCalledWith(
            `${LocalStorageKeys.Settings}-123`,
            settings,
        );
    });

    it('should close dialog on close', () => {
        const event = new Event('click');
        component.closeDialog(event);

        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
