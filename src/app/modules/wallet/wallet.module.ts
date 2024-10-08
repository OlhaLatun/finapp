import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WalletComponent } from '../../components/wallet/wallet.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        SharedModule,
    ],
    declarations: [WalletComponent],
    providers: [],
})
export class WalletModule {}
