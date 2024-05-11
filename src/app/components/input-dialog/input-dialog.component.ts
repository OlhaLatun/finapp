import {
    Component,
    EventEmitter,
    Inject,
    OnInit,
    Optional,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialog implements OnInit {
    public dialogForm: FormGroup;
    @Output() public onInputDialogSubmit: EventEmitter<number>;

    constructor(
        private readonly formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<InputDialog>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: { currency: string; category: string },
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
        const value = this.dialogForm.get('amountSpent').value;
        if (this.dialogForm.valid && !!value) {
            this.dialogRef.close({ inputValue: value });
        }
    }
}
