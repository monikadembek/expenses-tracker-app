import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { ShowExpensesComponent } from './show-expenses/show-expenses.component';
import { AuthGuard } from '../../auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'expenses',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ShowExpensesComponent },
      { path: 'add', component: AddExpensesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
