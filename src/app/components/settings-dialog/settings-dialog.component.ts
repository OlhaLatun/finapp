import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

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
    constructor(public dialogRef: DialogRef) {}

    public ngOnInit() {
        this.settingsForm = new FormGroup({
            currency: new FormControl('', [Validators.required]),
            income: new FormControl(0, [Validators.required]),
            secondIncomeName: new FormControl(''),
            secondIncomeValue: new FormControl(0),
            creditCard: new FormControl(false, [Validators.required]),
        });
    }

    public onSaveClick() {
        console.log(this.settingsForm);
    }

    public closeDialog(event: Event) {
        event.preventDefault();
        this.dialogRef.close();
    }
}
