import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { UserSettings } from '../../models/user-settings.model';

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
    public currency = [
        { name: 'USD', symbol: '$' },
        { name: 'UAH', symbol: '₴' },
    ];
    public settingsForm: FormGroup;
    public settings: UserSettings;
    public isDefaultSettings: boolean = true;
    constructor(
        public dialogRef: DialogRef,
        private readonly localStorageService: LocalStorageService,
    ) {}

    public ngOnInit() {
        this.settings = this.getSettings();

        this.settingsForm = new FormGroup({
            currency: new FormControl(
                {
                    value: this.settings?.currency,
                    disabled: !this.isDefaultSettings,
                },
                [Validators.required],
            ),
            income: new FormControl(
                {
                    value: this.settings?.income,
                    disabled: !this.isDefaultSettings,
                },
                [Validators.required],
            ),
            secondIncomeName: new FormControl(''),
            secondIncomeValue: new FormControl(0),
            creditCard: new FormControl(
                {
                    value: this.settings?.creditCard,
                    disabled: !this.isDefaultSettings,
                },
                [Validators.required],
            ),
        });
    }

    public onSaveClick() {
        if (this.settingsForm.valid) {
            const settings: UserSettings = new UserSettings({
                currency: this.settingsForm.get('currency')?.value,
                income: +this.settingsForm.get('income')?.value,
                creditCard: this.settingsForm.get('creditCard')?.value,
            });

            this.localStorageService.setItem(
                LocalStorageKeys.settings,
                settings,
            );
            this.dialogRef.close();
        }
    }

    public onResetClick(): void {
        this.settingsForm.reset({
            currency: { value: '', disabled: false },
            income: { value: 0, disabled: false },
            creditCard: { value: false, disabled: false },
        });
    }

    public closeDialog(event: Event) {
        event.preventDefault();
        this.dialogRef.close();
    }

    private getSettings(): UserSettings {
        if (this.localStorageService.getItem('settings')) {
            this.isDefaultSettings = !this.isDefaultSettings;
            return this.localStorageService.getItem('settings');
        } else {
            return new UserSettings();
        }
    }
}
