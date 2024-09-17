import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
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
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER } from '@angular/material/dialog';
import {
    I18NEXT_SERVICE,
    I18NextModule,
    I18NextTitle,
    ITranslationService,
} from 'angular-i18next';

export function appInit(i18next: ITranslationService) {
    return () =>
        i18next.init({
            lng: 'en',
            fallbackLng: 'en',
            debug: false,
            returnEmptyString: false,
            ns: ['translation', 'validation', 'error'],
            resources: {
                en: {
                    translation: {
                        currency: '{{value, currency}}',
                    },
                },
            },
            interpolation: {
                escapeValue: false,
                format: function (value, format, lng) {
                    if (format === 'currency') {
                        return new Intl.NumberFormat(lng, {
                            style: 'currency',
                            currency: lng === 'en' ? 'USD' : 'UAH',
                        }).format(value);
                    }
                    return value;
                },
            },
        });
}
export function localeIdFactory(i18next: ITranslationService) {
    return i18next.language;
}
export const I18N_PROVIDERS = [
    {
        provide: APP_INITIALIZER,
        useFactory: appInit,
        deps: [I18NEXT_SERVICE],
        multi: true,
    },
    {
        provide: Title,
        useClass: I18NextTitle,
    },
    {
        provide: LOCALE_ID,
        deps: [I18NEXT_SERVICE],
        useFactory: localeIdFactory,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        WalletComponent,
        BudgetPlannerComponent,
        AnalyticsComponent,
        NavigationComponent,
        SettingsDialogComponent,
        InputDialogComponent,
        ConfirmationPopupComponent,
    ],
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
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
        FormsModule,
        MatTableModule,
        DragDropModule,
        I18NextModule.forRoot(),
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
        I18N_PROVIDERS,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
