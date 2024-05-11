import { Injectable } from '@angular/core';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';
import { IncomeSource } from '../../interfaces/income-source.interface';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    public init(dbName: DBName, version: number): IDBOpenDBRequest {
        return window.indexedDB.open(dbName, version);
    }

    public open(dbName: DBName): IDBOpenDBRequest {
        return window.indexedDB.open(dbName);
    }

    public setIncomeSource(incomeSource: IncomeSource): void {
        let database: IDBDatabase;

        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            database = (event.target as IDBOpenDBRequest).result;

            database
                .transaction([DBStoreName.IncomeSource], 'readwrite')
                .objectStore(DBStoreName.IncomeSource)
                .add(incomeSource);
        };
    }

    public setExpenseCategory(expenseCategory: ExpenseCategory): void {
        let database: IDBDatabase;

        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            database = (event.target as IDBOpenDBRequest).result;

            database
                .transaction([DBStoreName.ExpenseCategory], 'readwrite')
                .objectStore(DBStoreName.ExpenseCategory)
                .add(expenseCategory);
        };
    }

    public getAllItemsFromStore(storeName: DBStoreName): Promise<[]> {
        return new Promise((resolve) => {
            const request = this.open(DBName.Wallet);
            request.onsuccess = (event) => {
                const database = (event.target as IDBOpenDBRequest).result;

                const getCategories = database
                    .transaction([storeName], 'readonly')
                    .objectStore(storeName)
                    .getAll();

                getCategories.onsuccess = (event) => {
                    const storeList = (event.target as IDBRequest).result;
                    resolve(storeList);
                };
            };
        });
    }

    public deleteItemFormStore(storeName: DBStoreName, id: number): void {
        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            database
                .transaction([storeName], 'readwrite')
                .objectStore(storeName)
                .delete(id);
        };
    }

    public getItemById(
        storeName: DBStoreName,
        itemId: number,
    ): Promise<IncomeSource | ExpenseCategory> {
        return new Promise((resolve) => {
            const request = this.open(DBName.Wallet);
            request.onsuccess = (event) => {
                const database = (event.target as IDBOpenDBRequest).result;
                const item = database
                    .transaction(storeName, 'readonly')
                    .objectStore(storeName)
                    .get(itemId);

                item.onsuccess = () => resolve(item.result);
            };
        });
    }

    public updateItem(
        storeName: DBStoreName,
        itemId: number,
        value: number,
    ): void {
        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            const objStore = database
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);

            const itemRequest = objStore.get(itemId);

            itemRequest.onsuccess = () => {
                const item = itemRequest.result;

                if (storeName === DBStoreName.ExpenseCategory) {
                    item.amount = item.amount + value;
                } else {
                    item.amount = value;
                }
                objStore.put(item);
            };
        };
    }
}
