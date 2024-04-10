import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    public currentUser: User | null;
    @Output() public onLogout: EventEmitter<void> = new EventEmitter();
    constructor(
        private readonly userService: UserService,
        private readonly dialog: MatDialog,
    ) {}
    public ngOnInit() {
        this.userService.getCurrentUserObservable().subscribe((user) => {
            this.currentUser = user;
        });
    }

    public logout(): void {
        this.onLogout.emit();
    }

    public showSettingsDialog(): void {
        this.dialog.open(SettingsDialogComponent, {
            height: '535px',
            width: '600px',
            panelClass: 'my-dialog',
        });
    }
}
