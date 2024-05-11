import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { AuthComponent } from './modules/auth/pages/login/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {
    MAT_RADIO_DEFAULT_OPTIONS,
    MatRadioModule,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { WalletComponent } from './components/wallet/wallet.component';
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
import { InputDialog } from './components/input-dialog/input-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        WalletComponent,
        BudgetPlannerComponent,
        AnalyticsComponent,
        NavigationComponent,
        SettingsDialogComponent,
        InputDialog,
    ],
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule,
        MatTableModule,
        DragDropModule,
    ],
    providers: [
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
