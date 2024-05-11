import { Injectable } from '@angular/core';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBName, DBStoreName } from '../../enums/indexedDB.enum';
import { IncomeSource } from '../../interfaces/income-source.interface';

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

    public async updateIncomeSourceAmount(
        itemId: number,
        value: number,
        deletion?: boolean,
    ): Promise<void> {
        let valueToUpdate: number;
        const incomeSource: IncomeSource = await this.getIncomeSourceById(
            itemId,
        );

        if (deletion) {
            valueToUpdate = incomeSource.amount + value;
        } else {
            valueToUpdate = incomeSource.amount - value;
        }

        this.indexedDBService.updateItem(
            DBStoreName.IncomeSource,
            itemId,
            valueToUpdate,
        );
    }

    public deleteItem(id: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            id,
        );
    }

    public getIncomeSourceById(itemId: number): Promise<IncomeSource> {
        return this.indexedDBService.getItemById(
            DBStoreName.IncomeSource,
            itemId,
        );
    }
}
