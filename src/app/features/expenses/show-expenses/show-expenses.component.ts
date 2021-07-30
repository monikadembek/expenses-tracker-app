import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Expense } from '../models/Expense';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-show-expenses',
  templateUrl: './show-expenses.component.html',
  styleUrls: ['./show-expenses.component.scss']
})
export class ShowExpensesComponent implements OnInit {

  expenses$: Observable<Expense[]> = of([]);

  constructor(private expensesService: ExpensesService) {
    this.getExpenses();
  }

  ngOnInit(): void {
    this.expenses$ = this.expensesService.expenses$;
  }

  getExpenses(): void {
    this.expensesService.requestExpenses().subscribe();
  }

  delete(id: string): void {
    this.expensesService.deleteExpense(id);
  }

}
