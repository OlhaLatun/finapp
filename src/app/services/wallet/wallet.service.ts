import { Injectable, OnDestroy } from '@angular/core';
import { first, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { UserSettings } from '../../models/user-settings.model';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../local-storage.service';
import { UserService } from '../user.service';

@Injectable({
    providedIn: 'root',
})
export class WalletService implements OnDestroy {
    private readonly unsubscriber = new Subject<void>();

    constructor(
        private readonly indexedDBService: IndexedDbService,
        private readonly localStorageService: LocalStorageService,
        private readonly userService: UserService,
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
        return this.getCurrentUserExpenseCategories().pipe(
            switchMap((expenseCategories) => {
                const updatedCategories = expenseCategories.filter(
                    (item) => item.id !== expenseCategory.id,
                );

                updatedCategories.push(updatedCategory);

                return this.indexedDBService.setItem(
                    DBStoreName.ExpenseCategory,
                    this.userService.getUserID(),
                    updatedCategories,
                );
            }),
        );
    }

    public updateIncomeSourceAmount(
        incomeSourceId: number,
        newValue: number,
        deletion?: boolean,
    ): Observable<void> {
        return this.getCurrentUserIncomeSource().pipe(
            takeUntil(this.unsubscriber),
            switchMap((incomeSource) => {
                const incomeSourceItem = incomeSource.find(
                    (item) => item.id === incomeSourceId,
                );
                let valueToUpdate: number;
                if (deletion) {
                    valueToUpdate = incomeSourceItem.amount + newValue;
                } else {
                    valueToUpdate = incomeSourceItem.amount - newValue;
                }

                const updatedSource: IncomeSource = {
                    ...incomeSourceItem,
                    amount: valueToUpdate,
                };

                const updatedIncomeSource: IncomeSource[] = [
                    ...incomeSource.filter(
                        (item) => item.id !== incomeSourceId,
                    ),
                    updatedSource,
                ];

                return this.indexedDBService.setItem(
                    DBStoreName.IncomeSource,
                    this.userService.getUserID(),
                    updatedIncomeSource,
                );
            }),
        );
    }

    public deleteUserDataFromStore(storeName: DBStoreName, id: number): void {
        this.indexedDBService.deleteItemFormStore(storeName, id);
    }

    public getIncomeSourceById(id: number): Observable<IncomeSource> {
        return this.getCurrentUserIncomeSource().pipe(
            map((incomeSource) => incomeSource.find((item) => item.id === id)),
            first(),
        );
    }
    public getExpenseCategoryById(id: number): Observable<IncomeSource> {
        return this.getCurrentUserExpenseCategories().pipe(
            map(
                (expenseCategory) =>
                    expenseCategory.find((item) => item.id === id),
                first(),
            ),
        );
    }

    public getCurrentUserIncomeSource(): Observable<IncomeSource[]> {
        return this.indexedDBService.getItemById(
            DBStoreName.IncomeSource,
            this.userService.getUserID(),
        );
    }

    public getCurrentUserExpenseCategories(): Observable<ExpenseCategory[]> {
        return this.indexedDBService.getItemById(
            DBStoreName.ExpenseCategory,
            this.userService.getUserID(),
        );
    }

    public setIncomeSource(incomeSourceItem: IncomeSource): Observable<void> {
        return this.indexedDBService
            .getItemById(DBStoreName.IncomeSource, this.userService.getUserID())
            .pipe(
                switchMap((incomeSource) => {
                    const data = incomeSource || [];
                    return this.indexedDBService.setItem(
                        DBStoreName.IncomeSource,
                        this.userService.getUserID(),
                        [...data, incomeSourceItem],
                    );
                }),
            );
    }

    public setExpenseCategory(
        expenseCategory: ExpenseCategory,
    ): Observable<void> {
        return this.indexedDBService
            .getItemById(
                DBStoreName.ExpenseCategory,
                this.userService.getUserID(),
            )
            .pipe(
                switchMap((expenseCategories) => {
                    const data = expenseCategories || [];
                    return this.indexedDBService.setItem(
                        DBStoreName.ExpenseCategory,
                        this.userService.getUserID(),
                        [...data, expenseCategory],
                    );
                }),
            );
    }

    public deleteExpenseCategory(expenseCategoryId: number): Observable<void> {
        return this.indexedDBService
            .getItemById(
                DBStoreName.ExpenseCategory,
                this.userService.getUserID(),
            )
            .pipe(
                switchMap((expenseCategories) => {
                    const data = expenseCategories.filter(
                        (item) => item.id !== expenseCategoryId,
                    );

                    return this.indexedDBService.setItem(
                        DBStoreName.ExpenseCategory,
                        this.userService.getUserID(),
                        [...data],
                    );
                }),
            );
    }
}
