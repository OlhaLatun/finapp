import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';

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

    public setItem(
        storeName: DBStoreName,
        id: string,
        item: any,
    ): Promise<any> {
        const store =
            storeName === DBStoreName.IncomeSource
                ? this.incomeSourceStore
                : this.expenseCategoryStore;

        return store.setItem(id, item);
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
