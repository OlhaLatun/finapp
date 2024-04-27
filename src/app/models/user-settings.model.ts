export class UserSettings {
    currency: string = 'USD';
    income: number = 0;
    creditCard: boolean = false;

    constructor(data?: Partial<UserSettings>) {
        if (data) {
            Object.keys(data).forEach((key: string) => {
                this[key] = data[key];
            });
        }
    }
}
