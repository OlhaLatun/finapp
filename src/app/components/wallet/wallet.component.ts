import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    public incomeSourceform: FormGroup;
    public expenseCategoryform: FormGroup;
    public expenseCategories = [];
    public incomeSource = [];
    public displayedColumns = {
        expenseCategory: ['position', 'expenses', 'spent', 'delete'],
        incomeSource: ['position', 'source', 'amount'],
    };
    public currency = 'USD';
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly indexedDBService: IndexedDbService,
        private readonly localStorage: LocalStorageService,
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
            this.incomeSourceform.get('incomeSource').value &&
            this.incomeSourceform.valid
        ) {
            this.indexedDBService.setIncomeSource({
                name: this.incomeSourceform.get('incomeSource').value,
                amount: +this.incomeSourceform.get('incomeAmount').value,
            });
            this.incomeSourceform.get('incomeSource').reset();
            this.getIncomeSource();
        }
    }

    public onExpenseCategorySubmit(): void {
        if (this.expenseCategoryform.get('expenseCategory').value) {
            this.indexedDBService.setExpenseCategory({
                name: this.expenseCategoryform.get('expenseCategory').value,
                id: Math.floor(Math.random() * 1000),
            });
            this.expenseCategoryform.get('expenseCategory').reset();
            this.getExpenseCategories();
        }
    }

    public drop(event) {
        console.log(event.event.target.closest('div[id]'));
    }

    private initForms(): void {
        this.incomeSourceform = this.formBuilder.group({
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

        this.expenseCategoryform = this.formBuilder.group({
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

    public deleteItem(index: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            index,
        );
        this.getExpenseCategories();
    }

    protected readonly event = event;
}
