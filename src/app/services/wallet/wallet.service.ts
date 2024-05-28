import { Injectable, OnDestroy } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletService implements OnDestroy {
    private readonly incomeSourceItem: BehaviorSubject<IncomeSource> =
        new BehaviorSubject<IncomeSource>(null);

    private readonly expenseCategoryItem: BehaviorSubject<ExpenseCategory> =
        new BehaviorSubject<ExpenseCategory>(null);

    private readonly unsubscriber = new Subject<void>();
    constructor(private readonly indexedDBService: IndexedDbService) {}

    ngOnDestroy() {
        this.unsubscriber.next();
        this.unsubscriber.complete();
    }

    public getIncomeSourceItem(): IncomeSource {
        return this.incomeSourceItem.getValue();
    }
    public getExpenseCategoryItem(): IncomeSource {
        return this.incomeSourceItem.getValue();
    }

    public initWalletDatabase(): void {
        this.indexedDBService.initExpenseCategoryStore();
        this.indexedDBService.initIncomeSourceStore();
    }

    public updateExpenseAmount(
        expenseCategory: ExpenseCategory,
        value: number,
    ): Observable<any> {
        const updatedCategory: ExpenseCategory = {
            ...expenseCategory,
            amount: expenseCategory.amount + value,
        };
        return this.indexedDBService.setExpenseCategory(updatedCategory);
    }

    public updateIncomeSourceAmount(
        incomeSourceId: number,
        newValue: number,
        deletion?: boolean,
    ): Observable<IncomeSource> {
        return this.indexedDBService.getIncomeSourceById(incomeSourceId).pipe(
            takeUntil(this.unsubscriber),
            switchMap((incomeSource) => {
                let valueToUpdate: number;
                if (deletion) {
                    valueToUpdate = incomeSource.amount + newValue;
                } else {
                    valueToUpdate = incomeSource.amount - newValue;
                }

                const updatedIncomeSource: IncomeSource = {
                    ...incomeSource,
                    amount: valueToUpdate,
                };
                return this.indexedDBService.setIncomeSource(
                    updatedIncomeSource,
                );
            }),
        );
    }

    public deleteItem(id: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            id,
        );
    }

    public setIncomeSourceItem(itemId: number): void {
        this.indexedDBService
            .getIncomeSourceById(itemId)
            .pipe(
                takeUntil(this.unsubscriber),
                tap((item) => {
                    this.incomeSourceItem.next(item);
                }),
            )
            .subscribe();
    }

    public setExpenseCategoryItem(itemId: number): void {
        this.indexedDBService
            .getExpenseCategoryById(itemId)
            .pipe(
                takeUntil(this.unsubscriber),
                tap((item) => {
                    this.expenseCategoryItem.next(item);
                }),
            )
            .subscribe();
    }
}
