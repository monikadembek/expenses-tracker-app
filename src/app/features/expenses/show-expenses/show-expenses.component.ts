import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Expense } from '../models/Expense';
import { Filters } from '../models/Filters';
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
  sum = 0;
  initialFilters: Filters = {
    category: null,
    startDate: new Date(),
    endDate: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))
  };

  constructor(private expensesService: ExpensesService) {
    this.getExpenses();
  }

  ngOnInit(): void {
    this.expenses$ = this.prepareExpensesList(this.initialFilters);
  }

  private prepareExpensesList(filters: Filters): Observable<Expense[]> {
    return this.expensesService.expenses$.pipe(
      filter((expenses: Expense[]) => expenses.length > 0),
      map((expenses: Expense[]) => {
        if (filters.category !== null) {
          return expenses.filter(expense => expense.category === filters.category);
        }
        return expenses;
      }),
      map((expenses: Expense[]) => {
        return expenses.filter(expense => (expense.date.seconds * 1000) <= filters.startDate.getTime() 
        && (expense.date.seconds * 1000) >= filters.endDate.getTime());
      }),
      map(expenses => {
        const values = expenses.map(expense => expense.value);
        this.sum = values.reduce((acc, curr) => acc + curr, 0);
        return expenses;
      })
    );
  }

  private getExpenses(): void {
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

  handleExpenseUpdate(): void {
    this.getExpenses();
  }

  onFiltersSet(filters: Filters): void {
    console.log('filters emitted ', filters);
    this.expenses$ = this.prepareExpensesList(filters);
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
