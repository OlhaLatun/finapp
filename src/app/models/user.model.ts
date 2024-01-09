
import { UserName } from '../interfaces/user.interface';

export class User {

  public name = '';
  public email = '';
  public userId = '';
  public 'user-token' = '';

  assign(data: Partial<UserName>){
      Object.assign(this, data)
    return this;
  }
}
