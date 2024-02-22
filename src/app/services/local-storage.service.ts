import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public getItem(key: string): string {
        return localStorage.getItem(key)
            ? JSON.parse(localStorage.getItem(key) || '')
            : null;
    }

    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    public clearStorage(): void {
        localStorage.clear();
    }
}
