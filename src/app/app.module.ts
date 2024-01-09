import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
    declarations: [AppComponent, AuthComponent, WalletComponent, BudgetPlannerComponent, AnalyticsComponent],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
        AuthApiService,
        UserService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
