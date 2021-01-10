import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ShowExpensesComponent } from './show-expenses/show-expenses.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';


@NgModule({
  declarations: [ShowExpensesComponent, AddExpensesComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
