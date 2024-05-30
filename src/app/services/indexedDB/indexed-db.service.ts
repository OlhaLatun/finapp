import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { from, Observable, of, switchMap } from 'rxjs';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { IncomeSource } from '../../interfaces/income-source.interface';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    public incomeSourceStore: LocalForage;
    public expenseCategoryStore: LocalForage;

    public initIncomeSourceStore(): void {
        this.incomeSourceStore = localforage.createInstance({
            name: DBName.Wallet,
            storeName: DBStoreName.IncomeSource,
        });
    }
    public initExpenseCategoryStore(): void {
        this.expenseCategoryStore = localforage.createInstance({
            name: DBName.Wallet,
            storeName: DBStoreName.ExpenseCategory,
        });
    }

    public setIncomeSource(incomeSource: IncomeSource): Observable<void> {
        return from(
            this.incomeSourceStore.setItem(
                incomeSource.id.toString(),
                incomeSource,
            ),
        ).pipe(switchMap(() => of(null)));
    }

    public setExpenseCategory(
        expenseCategory: ExpenseCategory,
    ): Observable<void> {
        return from(
            this.expenseCategoryStore.setItem(
                expenseCategory.id.toString(),
                expenseCategory,
            ),
        ).pipe(switchMap(() => of(null)));
    }

    public async getAllItemsFromStore(storeName: DBStoreName): Promise<any[]> {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        const result = [];
        await store.iterate((item) => {
            result.push(item);
        });
        return result;
    }

    public getItemById(storeName: DBStoreName, itemId: string): Promise<any> {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        return store.getItem(itemId);
    }

    public deleteItemFormStore(storeName: DBStoreName, id: number): void {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        store.removeItem(id.toString()).then();
    }
}
