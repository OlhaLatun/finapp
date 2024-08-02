import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { InputDialogComponent } from './input-dialog.component';

describe('InputDialogComponent', () => {
    let component: InputDialogComponent;
    let fixture: ComponentFixture<InputDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<InputDialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [InputDialogComponent],
            imports: [ReactiveFormsModule, BrowserAnimationsModule],
            providers: [
                FormBuilder,
                { provide: MatDialogRef, useValue: dialogRefSpy },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        currency: 'USD',
                        category: 'Food',
                        incomeSource: { amount: 1000 } as IncomeSource,
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InputDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set shouldShowValidationMessage to true if amountSpent is greater than totalAmount', () => {
        component.dialogForm.get('amountSpent').setValue(2000);
        component.onDialogFormSubmit();
        expect(component.shouldShowValidationMessage).toBeTrue();
    });

    it('should set shouldShowValidationMessage to false if amountSpent is valid', () => {
        component.dialogForm.get('amountSpent').setValue(500);
        component.onDialogFormSubmit();
        expect(component.shouldShowValidationMessage).toBeFalse();
    });

    it('should close the dialog with the amountSpent if the form is valid', () => {
        component.dialogForm.get('amountSpent').setValue(500);
        component.onDialogFormSubmit();
        expect(dialogRefSpy.close).toHaveBeenCalledWith({ amountSpent: 500 });
    });

    it('should not close the dialog if the form is invalid', () => {
        component.dialogForm.get('amountSpent').setValue('');
        component.onDialogFormSubmit();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close the dialog without data when closeDialog is called', () => {
        const event = new Event('click');
        spyOn(event, 'preventDefault');

        component.closeDialog(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
