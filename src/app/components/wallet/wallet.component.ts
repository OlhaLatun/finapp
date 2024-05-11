import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { MatDialog } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { InputDialog } from '../input-dialog/input-dialog.component';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    public incomeSourceForm: FormGroup;
    public expenseCategoryForm: FormGroup;
    public expenseCategories: ExpenseCategory[] = [];
    public incomeSource: IncomeSource[] = [];
    public currency = 'USD';

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly indexedDBService: IndexedDbService,
        private readonly localStorage: LocalStorageService,
        private readonly dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.currency = this.localStorage.getItem(
            LocalStorageKeys.Settings,
        ).currency;

        this.initForms();
        this.initDatabase();
        this.getExpenseCategories();
        this.getIncomeSource();
    }

    public onIncomeSourceSubmit(): void {
        if (
            this.incomeSourceForm.get('incomeSource').value &&
            this.incomeSourceForm.valid
        ) {
            this.indexedDBService.setIncomeSource({
                name: this.incomeSourceForm.get('incomeSource').value,
                amount: +this.incomeSourceForm.get('incomeAmount').value,
            });
            this.incomeSourceForm.get('incomeSource').reset();
            this.getIncomeSource();
        }
    }

    public onExpenseCategorySubmit(): void {
        if (this.expenseCategoryForm.get('expenseCategory').value) {
            this.indexedDBService.setExpenseCategory({
                name: this.expenseCategoryForm.get('expenseCategory').value,
                id: Math.floor(Math.random() * 1000),
                amountSpent: 0,
            });
            this.expenseCategoryForm.get('expenseCategory').reset();
            this.getExpenseCategories();
        }
    }

    public onDropEvent(event): void {
        const categoryElem = event.event.target.closest('div[id]');

        const ref = this.dialog.open(InputDialog, {
            data: {
                currency: this.currency,
                category: categoryElem.dataset.category,
            },
            disableClose: true,
            height: '250px',
            width: '400px',
        });

        ref.afterClosed().subscribe((data) => {
            this.updateExpenseAmount(+categoryElem.id, +data?.inputValue);
        });
    }

    private initForms(): void {
        this.incomeSourceForm = this.formBuilder.group({
            incomeSource: [{ value: '', disabled: false }],
            incomeAmount: [
                { value: '', disabled: false },
                [
                    Validators.min(0),
                    Validators.required,
                    Validators.pattern(/^[0-9]/),
                ],
            ],
        });

        this.expenseCategoryForm = this.formBuilder.group({
            expenseCategory: [{ value: '', disabled: false }],
        });
    }

    private initDatabase(): void {
        const request = this.indexedDBService.init(DBName.Wallet, 1);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(DBStoreName.IncomeSource)) {
                db.createObjectStore(DBStoreName.IncomeSource, {
                    autoIncrement: true,
                });
            }

            if (!db.objectStoreNames.contains(DBStoreName.ExpenseCategory)) {
                db.createObjectStore(DBStoreName.ExpenseCategory, {
                    keyPath: 'id',
                });
            }
        };
    }

    public getExpenseCategories(): void {
        this.indexedDBService
            .getAllItemsFromStore(DBStoreName.ExpenseCategory)
            .then((data) => (this.expenseCategories = data));
    }

    public getIncomeSource(): void {
        this.indexedDBService
            .getAllItemsFromStore(DBStoreName.IncomeSource)
            .then((data) => (this.incomeSource = data));
    }

    public updateExpenseAmount(itemId: number, value: number): void {
        this.indexedDBService.updateItem(
            DBStoreName.ExpenseCategory,
            itemId,
            value,
        );
        this.getExpenseCategories();
    }

    public deleteItem(index: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            index,
        );
        this.getExpenseCategories();
    }
}
