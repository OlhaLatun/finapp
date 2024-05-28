import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { MatDialog } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { WalletService } from '../../services/wallet/wallet.service';
import { getCurrentMonthAndYear } from '../../utils/utils';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
    public incomeSourceForm: FormGroup;
    public expenseCategoryForm: FormGroup;
    public expenseCategories: ExpenseCategory[] = [];
    public incomeSource: IncomeSource[] = [];
    public currency = 'USD';
    public userID = this.localStorage.getItem(LocalStorageKeys.UserId) || null;
    @ViewChild('confirmationPopup') public confirmationPopup: TemplateRef<any>;

    private readonly unsubscriber: Subject<void> = new Subject<void>();

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

    public ngOnDestroy() {
        this.unsubscriber.next();
        this.unsubscriber.complete();
    }

    public ngOnInit(): void {
        this.currency = this.walletService.getSettings().currency;

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
            this.indexedDBService
                .setIncomeSource({
                    name: this.incomeSourceForm.get('incomeSource').value,
                    amount: +this.incomeSourceForm.get('incomeAmount').value,
                    id: Math.floor(Math.random() * 1000),
                })
                .pipe(takeUntil(this.unsubscriber))
                .subscribe(() => this.getIncomeSource());
            this.incomeSourceForm.reset('');

            this.getIncomeSource();
        }
    }

    public onExpenseCategorySubmit(): void {
        if (this.expenseCategoryForm.get('expenseCategory').value) {
            this.indexedDBService
                .setExpenseCategory({
                    name: this.expenseCategoryForm.get('expenseCategory').value,
                    id: Math.floor(Math.random() * 1000),
                    amount: 0,
                })
                .pipe(
                    tap(() => this.getExpenseCategories()),
                    takeUntil(this.unsubscriber),
                )
                .subscribe();
            this.expenseCategoryForm.reset();
        }
    }

    public onDropEvent(): void {
        const incomeSource: IncomeSource =
            this.walletService.getIncomeSourceItem();
        const expenseCategory: ExpenseCategory =
            this.walletService.getExpenseCategoryItem();

        const dialogRef = this.dialog.open(InputDialogComponent, {
            data: {
                currency: this.currency,
                category: expenseCategory.name,
                incomeSource,
            },
            disableClose: true,
            height: 'auto',
            width: '400px',
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data?.inputValue) {
                this.walletService
                    .updateExpenseAmount(expenseCategory, +data?.inputValue)
                    .pipe(
                        takeUntil(this.unsubscriber),
                        tap(() => this.getExpenseCategories()),
                    )
                    .subscribe();

                this.walletService
                    .updateIncomeSourceAmount(
                        incomeSource.id,
                        +data?.inputValue,
                    )
                    .pipe(
                        takeUntil(this.unsubscriber),
                        tap(() => this.getIncomeSource()),
                    )
                    .subscribe();
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
            .getExpenseCategoryList()
            .pipe(takeUntil(this.unsubscriber))
            .subscribe((categories) => (this.expenseCategories = categories));
    }

    private getIncomeSource(): void {
        this.indexedDBService
            .getIncomeSourceList()
            .pipe(takeUntil(this.unsubscriber))
            .subscribe((incomeSource) => {
                this.incomeSource = incomeSource;
            });
    }

    public deleteItem(itemId: number): void {
        this.indexedDBService
            .getExpenseCategoryById(itemId)
            .pipe(
                takeUntil(this.unsubscriber),
                tap((expenseCategoryToDelete) => {
                    if (expenseCategoryToDelete.amount > 0) {
                        const dialogRef = this.dialog.open(
                            ConfirmationPopupComponent,
                            {
                                width: '400px',
                                height: 'auto',
                                disableClose: true,
                                data: {
                                    categoryToDelete: expenseCategoryToDelete,
                                    currency: this.currency,
                                    incomeSource: this.incomeSource,
                                },
                            },
                        );

                        dialogRef.afterClosed().subscribe((data) => {
                            if (data.delete) {
                                this.walletService.deleteItem(itemId);
                                this.getExpenseCategories();

                                if (data.incomeSourceId) {
                                    this.walletService
                                        .updateIncomeSourceAmount(
                                            data.incomeSourceId,
                                            expenseCategoryToDelete.amount,
                                            true,
                                        )
                                        .pipe(takeUntil(this.unsubscriber))
                                        .subscribe(() =>
                                            this.getIncomeSource(),
                                        );
                                }
                            }
                        });
                    } else {
                        this.walletService.deleteItem(itemId);
                        this.getExpenseCategories();
                    }
                }),
            )
            .subscribe();
    }
}
