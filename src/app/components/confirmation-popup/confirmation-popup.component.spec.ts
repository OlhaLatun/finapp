import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPopupComponent } from './confirmation-popup.component';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ReactiveFormsModule } from '@angular/forms';

describe('ConfirmationPopupComponent', () => {
    let component: ConfirmationPopupComponent;
    let fixture: ComponentFixture<ConfirmationPopupComponent>;
    let dialogRefMock: jasmine.SpyObj<MatDialogRef<ConfirmationPopupComponent>>;
    let mockData: {
        categoryToDelete: ExpenseCategory;
        currency: string;
        incomeSource: IncomeSource[];
    };

    beforeEach(async () => {
        dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

        mockData = {
            categoryToDelete: { id: 1, name: 'Category 1', amount: 123 },
            currency: 'USD',
            incomeSource: [{ id: 1, name: 'Source 1', amount: 123 }],
        };

        await TestBed.configureTestingModule({
            declarations: [ConfirmationPopupComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock },
                { provide: MAT_DIALOG_DATA, useValue: mockData },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should close dialog when deleting item with preserving income source', () => {
        component.dropdownControl.setValue(mockData.incomeSource[0].id);
        component.deleteItem();
        expect(dialogRefMock.close).toHaveBeenCalledWith({
            delete: true,
            incomeSourceId: mockData.incomeSource[0].id,
        });
    });

    it('should close dialog when deleting item without preserving income source', () => {
        component.dropdownControl.setValue('');
        component.deleteItem();
        expect(dialogRefMock.close).toHaveBeenCalledWith({
            delete: true,
            incomeSourceId: null,
        });
    });

    it('should close dialog on delete cancel', () => {
        component.onCancelClick();
        expect(dialogRefMock.close).toHaveBeenCalledWith({});
    });
});
