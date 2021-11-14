import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';

const routes: Routes = [{
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardContainerComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
