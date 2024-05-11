import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { MatDialog } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { InputDialog } from '../input-dialog/input-dialog.component';
import { WalletService } from '../../services/wallet/wallet.service';
import { getCurrentMonthAndYear } from '../../utils/utils';

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
        private readonly walletService: WalletService,
    ) {}

    public getDate(): string {
        return getCurrentMonthAndYear();
    }

    ngOnInit(): void {
        this.currency = this.localStorage.getItem(
            LocalStorageKeys.Settings,
        ).currency;

        this.initForms();
        this.walletService.initWalletDatabase();
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
                id: Math.floor(Math.random() * 1000),
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

    public async onDropEvent(event): Promise<void> {
        const incomeSourceElem = event.item.element.nativeElement;
        const categoryElem = event.event.target.closest('div[id]');
        const incomeSource = await this.walletService.getIncomeSourceById(
            +incomeSourceElem.id,
        );

        const dialogRef = this.dialog.open(InputDialog, {
            data: {
                currency: this.currency,
                category: categoryElem.dataset.category,
                incomeSource,
            },
            disableClose: true,
            height: 'auto',
            width: '400px',
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data?.inputValue) {
                this.walletService.updateExpenseAmount(
                    +categoryElem.id,
                    +data?.inputValue,
                );
                this.walletService.updateIncomeSourceAmount(
                    +incomeSourceElem.id,
                    +data?.inputValue,
                );

                this.getExpenseCategories();
                this.getIncomeSource();
            }
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

    private getExpenseCategories(): void {
        this.indexedDBService
            .getAllItemsFromStore(DBStoreName.ExpenseCategory)
            .then((data) => (this.expenseCategories = data));
    }

    private getIncomeSource(): void {
        this.indexedDBService
            .getAllItemsFromStore(DBStoreName.IncomeSource)
            .then((data) => (this.incomeSource = data));
    }

    public deleteItem(itemId: number): void {
        this.walletService.deleteItem(itemId);
        this.getExpenseCategories();
    }
}
