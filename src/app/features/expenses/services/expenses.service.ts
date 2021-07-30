import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../models/Expense';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../../../auth/services/auth.service';
import { DataAccessService } from '../../../core/services/data-access.service';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { ExpensesStore } from './expenses-store';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  // get userId(): string {
  //   return this.authService.userId;
  // }

  constructor(private authService: AuthService,
              private dataAccessService: DataAccessService,
              private expensesStore: ExpensesStore) { }

  addExpense(expense: Partial<Expense>): Observable<DocumentReference<unknown> | string> {
    let expenseData = null;
    return this.authService.user$.pipe(
      map(data => {
        expenseData = {
          ...expense,
          uid: data.uid
        };
        console.log('*expenseData - add', expenseData);
        return expenseData;
      }),
      concatMap(data => this.dataAccessService.addExpenseToDb(data))
    );
  }

  requestExpenses(): Observable<Expense[]> {
    return this.authService.user$.pipe(
      map(data => data.uid),
      switchMap(uid => this.dataAccessService.getExpensesFromDb(uid))
    );
  }

  get expenses$(): Observable<Expense[]> {
    return this.expensesStore.getPartialState<Expense[]>(['expenses']);
  }

  deleteExpense(id: string): void {
    this.dataAccessService.deleteExpenseFromDb(id)
    .then(data => this.updateExpensesInStore(id))
    .catch(error => console.log(error));
  }

  private updateExpensesInStore(id: string): void {
    const filteredOutExpenses = this.expensesStore.state.expenses.filter(expense => expense.id !== id);
    this.expensesStore.setPartialState<Expense[]>('expenses', filteredOutExpenses);
  }

}
