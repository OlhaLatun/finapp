import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { from, Observable } from 'rxjs';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { IncomeSource } from '../../interfaces/income-source.interface';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    private incomeSourceStore: LocalForage;
    private expenseCategoryStore: LocalForage;

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

    public setIncomeSource(incomeSource: IncomeSource): Observable<any> {
        return from(
            this.incomeSourceStore.setItem(
                incomeSource.id.toString(),
                incomeSource,
            ),
        );
    }

    public setExpenseCategory(
        expenseCategory: ExpenseCategory,
    ): Observable<any> {
        return from(
            this.expenseCategoryStore.setItem(
                expenseCategory.id.toString(),
                expenseCategory,
            ),
        );
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

    public deleteItemFormStore(storeName: DBStoreName, id: number): void {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        store.removeItem(id.toString()).then();
    }

    public async getItemById(
        storeName: DBStoreName,
        itemId: number,
    ): Promise<any> {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        return await store.getItem(itemId.toString());
    }
}
