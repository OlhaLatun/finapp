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

            const storeRequest = database
                .transaction([DBStoreName.IncomeSource], 'readwrite')
                .objectStore(DBStoreName.IncomeSource)
                .add(incomeSource);

            storeRequest.onsuccess = (event) => {
                console.log(event);
            };
        };
    }

    public setExpenseCategory(expenseCategory: string): void {
        let database: IDBDatabase;

        const request = this.open(DBName.Wallet);
        request.onsuccess = (event) => {
            database = (event.target as IDBOpenDBRequest).result;

            const storeRequest = database
                .transaction([DBStoreName.ExpenseCategory], 'readwrite')
                .objectStore(DBStoreName.ExpenseCategory)
                .add(expenseCategory);

            storeRequest.onsuccess = (event) => {
                console.log(event);
            };
        };
    }
}
