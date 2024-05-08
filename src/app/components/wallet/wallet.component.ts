import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    public form: FormGroup;
    public expenseCategories = [];
    displayedColumns: string[] = ['position', 'expenses', 'delete'];
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly indexedDBService: IndexedDbService,
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            incomeSource: [{ value: '', disabled: false }],
            expenseCategory: [{ value: '', disabled: false }],
        });
        this.initDatabase();
        this.setExpenseCategories();
    }

    public onSubmit(): void {
        if (this.form.get('incomeSource').value) {
            this.indexedDBService.setIncomeSource(
                this.form.get('incomeSource').value,
            );
        }

        if (this.form.get('expenseCategory').value) {
            this.indexedDBService.setExpenseCategory({
                name: this.form.get('expenseCategory').value,
                id: Math.floor(Math.random() * 1000),
            });
            this.setExpenseCategories();
        }

        this.form.reset();
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

    public setExpenseCategories(): void {
        this.indexedDBService
            .getAllItemsFromStore(DBStoreName.ExpenseCategory)
            .then((data) => (this.expenseCategories = data));
    }

    public deleteItem(index: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            index,
        );
        this.setExpenseCategories();
    }
}
