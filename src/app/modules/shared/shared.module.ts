import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18NextModule } from 'angular-i18next';
import { I18N_PROVIDERS } from '../../utils/localization-config';

@NgModule({
    imports: [CommonModule, I18NextModule],
    declarations: [],
    providers: [I18N_PROVIDERS],
    exports: [I18NextModule],
})
export class SharedModule {}
