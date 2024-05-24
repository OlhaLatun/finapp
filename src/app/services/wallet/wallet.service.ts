import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IndexedDbService } from '../indexedDB/indexed-db.service';
import { DBStoreName } from '../../enums/indexedDB.enum';
import { IncomeSource } from '../../interfaces/income-source.interface';
import { ExpenseCategory } from '../../interfaces/expense-category.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    constructor(private readonly indexedDBService: IndexedDbService) {}

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
        return this.indexedDBService.setExpenseCategory(updatedCategory);
    }

    public async updateIncomeSourceAmount(
        incomeSourceId: number,
        newValue: number,
        deletion?: boolean,
    ): Promise<void> {
        let valueToUpdate: number;
        const incomeSource = await this.indexedDBService.getItemById(
            DBStoreName.IncomeSource,
            incomeSourceId,
        );

        if (deletion) {
            valueToUpdate = incomeSource.amount + newValue;
        } else {
            valueToUpdate = incomeSource.amount - newValue;
        }

        const updatedIncomeSource: IncomeSource = {
            ...incomeSource,
            amount: valueToUpdate,
        };

        this.indexedDBService.setIncomeSource(updatedIncomeSource);
    }

    public deleteItem(id: number): void {
        this.indexedDBService.deleteItemFormStore(
            DBStoreName.ExpenseCategory,
            id,
        );
    }

    public getItemById(
        storeName: DBStoreName,
        itemId: number,
    ): Promise<IncomeSource> {
        return this.indexedDBService.getItemById(storeName, itemId);
    }
}
