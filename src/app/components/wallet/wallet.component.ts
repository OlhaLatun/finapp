import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    combineLatest,
    filter,
    forkJoin,
    map,
    Observable,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { WalletService } from '../../services/wallet/wallet.service';
import { getCurrentMonthAndYear } from '../../utils/utils';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import i18next from 'i18next';

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
    private droppedIncomeSource: IncomeSource;
    private expenseCategoryDropZone: ExpenseCategory;
    public Html = `
        <a href="https://logwork.com/free-currency-converter-calculator" class="currency_convertor" data-currencies="USD,EUR,JPY,GBP,CNY,INR">Currency Converter</a>`;
    public trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.Html);

    @ViewChild('confirmationPopup') public confirmationPopup: TemplateRef<any>;

    private readonly unsubscriber: Subject<void> = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialog: MatDialog,
        private readonly walletService: WalletService,
        private readonly sanitizer: DomSanitizer,
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

        const script = document.createElement('script');
        script.src = 'https://cdn.logwork.com/widget/currency_converter.js';
        script.async = true;
        document.body.appendChild(script);
    }

    public onIncomeSourceSubmit(): void {
        this.walletService
            .setIncomeSource({
                name: this.incomeSourceForm.get('incomeSource').value,
                amount: +this.incomeSourceForm.get('incomeAmount').value,
                id: Math.floor(Math.random() * 1000),
            })
            .pipe(
                tap(() => this.getIncomeSource()),
                takeUntil(this.unsubscriber),
            )
            .subscribe();
        if (
            this.incomeSourceForm.get('incomeSource').value &&
            this.incomeSourceForm.valid
        ) {
            this.incomeSourceForm.reset('');
        }
    }

    public onExpenseCategorySubmit(): void {
        if (this.expenseCategoryForm.get('expenseCategory').value) {
            this.walletService
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

    public onDropEvent(event): void {
        const incomeSourceElemId = event.item.element.nativeElement.id;
        const categoryElemId = event.event.target.closest('div[id]').id;

        this.setDropItems(+incomeSourceElemId, +categoryElemId)
            .pipe(
                switchMap(() => {
                    return this.openInputDialog().pipe(
                        filter((data) => !!data?.amountSpent),
                        switchMap((data) =>
                            forkJoin([
                                this.walletService.updateExpenseAmount(
                                    this.expenseCategoryDropZone,
                                    +data?.amountSpent,
                                ),
                                this.walletService.updateIncomeSourceAmount(
                                    this.droppedIncomeSource.id,
                                    +data?.amountSpent,
                                ),
                            ]),
                        ),
                        tap(() => {
                            this.getExpenseCategories();
                            this.getIncomeSource();
                        }),
                    );
                }),
            )

            .subscribe();
    }

    private openInputDialog(): Observable<{ amountSpent: string }> {
        if (this.droppedIncomeSource.amount === 0) return;

        const dialogRef = this.dialog.open(InputDialogComponent, {
            data: {
                currency: this.currency,
                category: this.expenseCategoryDropZone.name,
                incomeSource: this.droppedIncomeSource,
            },
            disableClose: true,
            height: 'auto',
            width: '400px',
        });

        return dialogRef.afterClosed();
    }

    private setDropItems(
        incomeSourceId: number,
        categoryElemId: number,
    ): Observable<[IncomeSource, IncomeSource]> {
        return combineLatest([
            this.walletService.getIncomeSourceById(incomeSourceId),
            this.walletService.getExpenseCategoryById(categoryElemId),
        ]).pipe(
            tap(([incomeSource, expenseCategory]) => {
                (this.expenseCategoryDropZone = expenseCategory),
                    (this.droppedIncomeSource = incomeSource);
            }),
        );
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
        this.walletService
            .getCurrentUserExpenseCategories()
            .pipe(
                map((source) =>
                    source.map((item) => {
                        return {
                            ...item,
                            amount: i18next.t('currency', {
                                value: item.amount,
                                currency: this.currency,
                            }),
                        } as unknown as ExpenseCategory;
                    }),
                ),
                tap((categories) => (this.expenseCategories = categories)),
                takeUntil(this.unsubscriber),
            )
            .subscribe();
    }

    private getIncomeSource(): void {
        this.walletService
            .getCurrentUserIncomeSource()
            .pipe(
                map((source) =>
                    source.map((item) => {
                        return {
                            ...item,
                            amount: i18next.t('currency', {
                                value: item.amount,
                                currency: this.currency,
                            }),
                        } as unknown as IncomeSource;
                    }),
                ),
                tap((incomeSource) => {
                    this.incomeSource = incomeSource;
                }),
                takeUntil(this.unsubscriber),
            )
            .subscribe();
    }

    public deleteExpenseCategory(category: ExpenseCategory): void {
        if (category.amount) {
            this.dialog
                .open(ConfirmationPopupComponent, {
                    data: {
                        categoryToDelete: category,
                        currency: this.currency,
                        incomeSource: this.incomeSource,
                    },
                })
                .afterClosed()
                .pipe(
                    filter((data) => !!data.delete),
                    switchMap((data) =>
                        this.walletService.updateIncomeSourceAmount(
                            data.incomeSourceId,
                            category.amount,
                            true,
                        ),
                    ),
                    switchMap(() =>
                        this.walletService
                            .deleteExpenseCategory(category.id)
                            .pipe(tap(() => this.getExpenseCategories())),
                    ),
                    tap(() => this.getIncomeSource()),
                )
                .subscribe();
        } else {
            this.walletService
                .deleteExpenseCategory(category.id)
                .pipe(tap(() => this.getExpenseCategories()))
                .subscribe();
        }
    }
}
