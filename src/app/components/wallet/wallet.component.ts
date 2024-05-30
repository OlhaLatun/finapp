import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    filter,
    forkJoin,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { IndexedDbService } from '../../services/indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
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
    private droppedIncomeSource: IncomeSource;
    private expenseCategoryDropZone: ExpenseCategory;

    @ViewChild('confirmationPopup') public confirmationPopup: TemplateRef<any>;

    private readonly unsubscriber: Subject<void> = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly indexedDBService: IndexedDbService,
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
        this.indexedDBService
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

    public onDropEvent(event): void {
        const incomeSourceElemId = event.item.element.nativeElement.id;
        const categoryElemId = event.event.target.closest('div[id]').id;

        this.setDropItems(incomeSourceElemId, categoryElemId)
            .pipe(switchMap(() => this.openInputDialog()))
            .pipe(
                filter((data) => !!data?.inputValue),
                switchMap((data) =>
                    forkJoin([
                        this.walletService.updateExpenseAmount(
                            this.expenseCategoryDropZone,
                            +data?.inputValue,
                        ),
                        this.walletService.updateIncomeSourceAmount(
                            this.droppedIncomeSource.id.toString(),
                            +data?.inputValue,
                        ),
                    ]),
                ),
                tap(() => {
                    this.getExpenseCategories();
                    this.getIncomeSource();
                }),
            )
            .subscribe();
    }

    private openInputDialog(): Observable<{ inputValue: string }> {
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
        incomeSourceId: string,
        categoryElemId: string,
    ): Observable<void> {
        return forkJoin({
            incomeSource:
                this.walletService.getIncomeSourceById(incomeSourceId),
            expenseCategory:
                this.walletService.getExpenseCategoryById(categoryElemId),
        }).pipe(
            takeUntil(this.unsubscriber),
            tap(({ incomeSource, expenseCategory }) => {
                this.droppedIncomeSource = incomeSource;
                this.expenseCategoryDropZone = expenseCategory;
            }),
            switchMap(() => of(null)),
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
            .getExpenseCategoryList()
            .pipe(
                tap((categories) => (this.expenseCategories = categories)),
                takeUntil(this.unsubscriber),
            )
            .subscribe();
    }

    private getIncomeSource(): void {
        this.walletService
            .getIncomeSourceList()
            .pipe(
                tap((incomeSource) => (this.incomeSource = incomeSource)),
                takeUntil(this.unsubscriber),
            )
            .subscribe();
    }

    public deleteItem(itemId: number): void {
        this.walletService
            .getExpenseCategoryById(itemId.toString())
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
                                this.walletService.deleteItem(
                                    DBStoreName.ExpenseCategory,
                                    itemId,
                                );
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
                        this.walletService.deleteItem(
                            DBStoreName.ExpenseCategory,
                            itemId,
                        );
                        this.getExpenseCategories();
                    }
                }),
            )
            .subscribe();
    }
}
