import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/pages/login/auth.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { BudgetPlannerComponent } from './components/budget-planner/budget-planner.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: AuthComponent },
    { path: 'signup', component: AuthComponent },
    { path: 'wallet', component: WalletComponent },
    { path: 'planner', component: BudgetPlannerComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: '**', redirectTo: 'login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
