import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { Observable } from 'rxjs';
import { TabLink } from '../../interfaces/tab-link.interface';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    public currentUser$: Observable<User | null>;
    @Output() public onLogout: EventEmitter<void> = new EventEmitter();
    constructor(
        private readonly userService: UserService,
        private readonly dialog: MatDialog,
    ) {}

    public links: TabLink[] = [
        { title: 'Wallet', key: 'wallet' },
        { title: 'Budget Planner', key: 'planner' },
        { title: 'Analytics', key: 'analytics' },
    ];
    public activeLink: TabLink = this.links[0];
    public ngOnInit() {
        this.currentUser$ = this.userService.getCurrentUserObservable();
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

    public setActiveLink(link: TabLink): void {
        this.activeLink = link;
    }
}
