import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { AuthComponent } from './modules/auth/pages/login/auth.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
    MAT_RADIO_DEFAULT_OPTIONS,
    MatRadioModule,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { BudgetPlannerComponent } from './components/budget-planner/budget-planner.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';
import { UserService } from './services/user.service';
import { LocalStorageService } from './services/local-storage.service';
import { UsersApiService } from './services/users.api.service';
import { AuthService } from './modules/auth/services/auth-service/auth.service';
import { AuthGuard } from './modules/auth/services/auth-guard/auth-guard.service';
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER } from '@angular/material/dialog';
import { WalletModule } from './modules/wallet/wallet.module';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        BudgetPlannerComponent,
        AnalyticsComponent,
        NavigationComponent,
        SettingsDialogComponent,
        InputDialogComponent,
        ConfirmationPopupComponent,
    ],
    imports: [
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule,
        MatRadioModule,
        MatTableModule,
        DragDropModule,
        WalletModule,
    ],
    providers: [
        provideAnimations(),
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
            provide: MAT_RADIO_DEFAULT_OPTIONS,
            useValue: { color: 'primary' },
        },
        AuthApiService,
        AuthService,
        UserService,
        LocalStorageService,
        UsersApiService,
        AuthGuard,
        MatDialog,
        HttpClient,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
