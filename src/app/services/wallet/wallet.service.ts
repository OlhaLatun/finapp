import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { UserSettings } from '../../models/user-settings.model';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class WalletService implements OnDestroy {
    private readonly unsubscriber = new Subject<void>();
    constructor(
        private readonly indexedDBService: IndexedDbService,
        private readonly localStorageService: LocalStorageService,
    ) {}

    ngOnDestroy() {
        this.unsubscriber.next();
        this.unsubscriber.complete();
    }
    public getSettings(): UserSettings {
        const userID =
            this.localStorageService.getItem(LocalStorageKeys.UserId) || null;

        if (
            this.localStorageService.getItem(
                `${LocalStorageKeys.Settings}-${userID}`,
            )
        ) {
            return this.localStorageService.getItem(
                `${LocalStorageKeys.Settings}-${userID}`,
            );
        } else {
            return new UserSettings();
        }
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
        return this.setExpenseCategory(updatedCategory);
    }

    public updateIncomeSourceAmount(
        incomeSourceId: string,
        newValue: number,
        deletion?: boolean,
    ): Observable<void> {
        return this.getIncomeSourceById(incomeSourceId).pipe(
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
                return this.indexedDBService.setItem(
                    DBStoreName.IncomeSource,
                    incomeSourceId,
                    updatedIncomeSource,
                );
            }),
        );
    }

    public deleteItem(storeName: DBStoreName, id: number): void {
        this.indexedDBService.deleteItemFormStore(storeName, id);
    }

    public getExpenseCategoryList(): Observable<ExpenseCategory[]> {
        return new Observable((observer) => {
            this.indexedDBService
                .getAllItemsFromStore(DBStoreName.ExpenseCategory)
                .then((items) => {
                    observer.next(items);
                    observer.complete();
                })
                .catch((error) => observer.error(error));
        });
    }

    public getIncomeSourceList(): Observable<IncomeSource[]> {
        return new Observable((observer) => {
            this.indexedDBService
                .getAllItemsFromStore(DBStoreName.IncomeSource)
                .then((items) => {
                    observer.next(items);
                    observer.complete();
                })
                .catch((error) => observer.error(error));
        });
    }

    public getIncomeSourceById(itemId: string): Observable<IncomeSource> {
        return new Observable<IncomeSource>((observer) => {
            this.indexedDBService
                .getItemById(DBStoreName.IncomeSource, itemId)
                .then((item) => {
                    observer.next(item as IncomeSource);
                    observer.complete();
                })
                .catch((reason) => observer.error(reason));
        });
    }

    public getExpenseCategoryById(itemId: string): Observable<ExpenseCategory> {
        return new Observable<ExpenseCategory>((observer) => {
            this.indexedDBService
                .getItemById(DBStoreName.ExpenseCategory, itemId)
                .then((item) => {
                    observer.next(item as ExpenseCategory);
                    observer.complete();
                })
                .catch((reason) => observer.error(reason));
        });
    }

    public setIncomeSource(incomeSource: IncomeSource): Observable<void> {
        return from(
            this.indexedDBService.setItem(
                DBStoreName.IncomeSource,
                incomeSource.id.toString(),
                incomeSource,
            ),
        ).pipe(switchMap(() => of(null)));
    }

    public setExpenseCategory(
        expenseCategory: ExpenseCategory,
    ): Observable<void> {
        return from(
            this.indexedDBService.setItem(
                DBStoreName.ExpenseCategory,
                expenseCategory.id.toString(),
                expenseCategory,
            ),
        ).pipe(switchMap(() => of(null)));
    }
}
