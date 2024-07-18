import { UserName } from '../interfaces/user.interface';

export class User {
    public name = '';
    public email = '';
    public objectId = '';
    public 'user-token' = '';

    constructor(data: Partial<UserName>) {
        this.assign(data);
    }

    assign(data: Partial<UserName>) {
        Object.assign(this, data);
        return this;
    }
}
