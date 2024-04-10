import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { AuthComponent } from './modules/auth/pages/login/auth.component';
import { AuthApiService } from './modules/auth/services/auth-api-service/auth.api.service';
import { HttpClientModule } from '@angular/common/http';
import { WalletComponent } from './components/wallet/wallet.component';
import { BudgetPlannerComponent } from './components/budget-planner/budget-planner.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { UserService } from './services/user.service';
import { LocalStorageService } from './services/local-storage.service';
import { UsersApiService } from './services/users.api.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import {
    MAT_RADIO_DEFAULT_OPTIONS,
    MatRadioModule,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from './modules/auth/services/auth-service/auth.service';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        WalletComponent,
        BudgetPlannerComponent,
        AnalyticsComponent,
        NavigationComponent,
        SettingsDialogComponent,
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
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
        {
            provide: MAT_RADIO_DEFAULT_OPTIONS,
            useValue: { color: 'primary' },
        },
        AuthApiService,
        AuthService,
        UserService,
        LocalStorageService,
        UsersApiService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
