import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-confirmation-popup',
    templateUrl: './confirmation-popup.component.html',
    styleUrls: ['./confirmation-popup.component.scss'],
})
export class ConfirmationPopupComponent {
    public dropdownControl: FormControl = new FormControl('');
    constructor(
        public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: {
            categoryToDelete: ExpenseCategory;
            currency: string;
            incomeSource: IncomeSource[];
        },
    ) {}
    public deleteItem(): void {
        this.dialogRef.close({
            delete: true,
            transferTo: this.dropdownControl.value || null,
        });
    }

    public onCancelClick(): void {
        this.dialogRef.close({});
    }
}
