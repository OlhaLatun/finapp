import { Injectable } from '@angular/core';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    constructor(private readonly indexedDBService: IndexedDbService) {}

    public initWalletDatabase(): void {
        const request = this.indexedDBService.init(DBName.Wallet, 1);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(DBStoreName.IncomeSource)) {
                db.createObjectStore(DBStoreName.IncomeSource, {
                    keyPath: 'id',
                });
            }

            if (!db.objectStoreNames.contains(DBStoreName.ExpenseCategory)) {
                db.createObjectStore(DBStoreName.ExpenseCategory, {
                    keyPath: 'id',
                });
            }
        };
    }

    public updateExpenseAmount(itemId: number, value: number): void {
        this.indexedDBService.updateItem(
            DBStoreName.ExpenseCategory,
            itemId,
            value,
        );
    }

    public updateIncomeSourceAmount(itemId: number, value: number): void {
        this.indexedDBService.updateItem(
            DBStoreName.IncomeSource,
            itemId,
            value,
        );
    }

    public deleteItem(index: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            index,
        );
    }
}
