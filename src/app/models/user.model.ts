import { BaseModel } from './base.model';
import { UserName } from '../interfaces/user.interface';

export class User extends BaseModel {

  public name = '';
  public email = '';
  public userId = '';
  public userToken = '';
  constructor(data: Partial<UserName>) {
    super();

    this.assign(data);
  }
}
