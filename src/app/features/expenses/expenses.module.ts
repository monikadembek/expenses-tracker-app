import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ShowExpensesComponent } from './show-expenses/show-expenses.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { ModifyExpenseFormComponent } from './modify-expense-form/modify-expense-form.component';


@NgModule({
  declarations: [
    ShowExpensesComponent,
    AddExpensesComponent,
    ModifyExpenseFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
