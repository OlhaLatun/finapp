import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    public currentUser: User | null;
    @Output() public onLogout: EventEmitter<any> = new EventEmitter();
    constructor(private readonly userService: UserService) {}
    public ngOnInit() {
        this.userService.getCurrentUserObservable().subscribe((user) => {
            this.currentUser = user;
        });
    }

    public logout() {
        this.onLogout.emit();
    }
}
