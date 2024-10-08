import {
    I18NEXT_SERVICE,
    I18NextTitle,
    ITranslationService,
} from 'angular-i18next';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
