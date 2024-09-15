import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
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
        return this.setExpenseCategory(updatedCategory);
    }

    // public updateIncomeSourceAmount(
    //     incomeSourceId: string,
    //     newValue: number,
    //     deletion?: boolean,
    // ): Observable<void> {
    //     // return this.getIncomeSourceById(this.userService.getUserID()).pipe(
    //     //     takeUntil(this.unsubscriber),
    //     //     switchMap((incomeSource) => {
    //     //         let valueToUpdate: number;
    //     //         if (deletion) {
    //     //             valueToUpdate = incomeSource.amount + newValue;
    //     //         } else {
    //     //             valueToUpdate = incomeSource.amount - newValue;
    //     //         }
    //     //
    //     //         const updatedIncomeSource: IncomeSource = {
    //     //             ...incomeSource,
    //     //             amount: valueToUpdate,
    //     //         };
    //     //         return this.indexedDBService.setItem(
    //     //             DBStoreName.IncomeSource,
    //     //             incomeSourceId,
    //     //             updatedIncomeSource,
    //     //         );
    //     //     }),
    //     // );
    // }

    public deleteItem(storeName: DBStoreName, id: number): void {
        this.indexedDBService.deleteItemFormStore(storeName, id);
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
}
