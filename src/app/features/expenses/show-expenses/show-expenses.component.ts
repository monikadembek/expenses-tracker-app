import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../models/Expense';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-show-expenses',
  templateUrl: './show-expenses.component.html',
  styleUrls: ['./show-expenses.component.scss']
})
export class ShowExpensesComponent implements OnInit, OnDestroy {

  unSubscribe$: Subject<void> = new Subject();
  expenses$: Observable<Expense[]> = of([]);
  expenseIndex: number = null;
  isFormDisplayed = false;

  constructor(private expensesService: ExpensesService) {
    this.getExpenses();
  }

  ngOnInit(): void {
    this.expenses$ = this.expensesService.expenses$;
  }

  getExpenses(): void {
    this.expensesService.requestExpenses()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe();
  }

  delete(id: string): void {
    this.expensesService.deleteExpense(id);
  }

  toggleForm(index: number): void {
    if ((this.expenseIndex === null || this.expenseIndex !== index) && this.isFormDisplayed === false) {
      this.isFormDisplayed = true;
    } else if (this.expenseIndex === index) {
      this.isFormDisplayed = !this.isFormDisplayed;
    }
    this.expenseIndex = index;
  }

  shouldShowForm(index: number): boolean {
    return this.isFormDisplayed === true && this.expenseIndex === index;
  }

  cancel(): void {
    this.isFormDisplayed = false;
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
