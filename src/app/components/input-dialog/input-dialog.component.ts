import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements OnInit {
    public dialogForm: FormGroup;
    public shouldShowValidationMessage: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<InputDialogComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: {
            currency: string;
            category: string;
            incomeSource: IncomeSource;
        },
    ) {}

    public ngOnInit() {
        this.dialogForm = this.formBuilder.group({
            amountSpent: [
                { value: '', disabled: false },
                [
                    Validators.min(0),
                    Validators.required,
                    Validators.pattern(/^[0-9]/),
                ],
            ],
        });
    }

    public onDialogFormSubmit(): void {
        const totalAmount = this.data.incomeSource.amount;
        const amountSpent = +this.dialogForm.get('amountSpent').value;
        this.shouldShowValidationMessage =
            totalAmount <= 0 || amountSpent > totalAmount;

        if (
            this.dialogForm.valid &&
            !!amountSpent &&
            !this.shouldShowValidationMessage
        ) {
            this.dialogRef.close({ amountSpent });
        }
    }

    public closeDialog(event): void {
        event.preventDefault();
        this.dialogRef.close();
    }
}
