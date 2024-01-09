import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  private readonly user = new BehaviorSubject<Partial<User>>(new User())

  public setCurrentUser(user: any): void {
    this.user.next(new User().assign(user))
  }

  public getCurrentUserObservable(): Observable<Partial<User>> {
   return  this.user.asObservable()
  }
}
