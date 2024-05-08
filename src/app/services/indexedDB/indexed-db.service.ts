import { Injectable } from '@angular/core';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    public init(dbName: string, version: number): IDBOpenDBRequest {
        return window.indexedDB.open(dbName, version);
    }

    public open(dbName: string): IDBOpenDBRequest {
        return window.indexedDB.open(dbName);
    }

    public setIncomeSource(incomeSource: string): void {
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

    public setExpenseCategory(expenseCategory: {
        name: string;
        id: number;
    }): void {
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

    public getAllItemsFromStore(storeName: string): Promise<[]> {
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

    public deleteItemFormStore(storeName: string, index: number): void {
        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            const getCategories = database
                .transaction([storeName], 'readwrite')
                .objectStore(storeName)
                .delete(index);

            getCategories.onsuccess = (event) => {
                console.log(event);
            };
        };
    }
}
