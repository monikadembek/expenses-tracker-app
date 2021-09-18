import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Expense } from '../models/Expense';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../../../auth/services/auth.service';
import { DataAccessService } from '../../../core/services/data-access.service';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { ExpensesStore } from './expenses-store';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SnackbarMessageType } from 'src/app/shared/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  // get userId(): string {
  //   return this.authService.userId;
  // }

  constructor(private authService: AuthService,
              private dataAccessService: DataAccessService,
              private expensesStore: ExpensesStore,
              private snackbarService: SnackbarService) { }

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
    .then(data => {
      this.updateExpensesInStore(id);
      this.snackbarService.displaySnackbarMessage('Expense has been deleted', SnackbarMessageType.Success);
    })
    .catch(error => {
      console.log(error);
      this.snackbarService.displaySnackbarMessage(`Error occured: ${error}`, SnackbarMessageType.Warning);
    });
  }

  private updateExpensesInStore(id: string): void {
    const filteredOutExpenses = this.expensesStore.state.expenses.filter(expense => expense.id !== id);
    this.expensesStore.setPartialState<Expense[]>('expenses', filteredOutExpenses);
  }

  modifyExpense(id: string, changes: Expense): Observable<Expense | string> {
    console.log('changes - service', changes, id);
    return from(this.dataAccessService.updateExpenseInDb(id, changes)
      .then(data => {
        this.updateExpensesInStoreAfterModify(id, changes);
        return changes;
      })
      .catch(error => {
        console.log('Error while modyfing expense: ', error);
        return `Error while modyfing expense: $error.message`;
      }));
  }

  private updateExpensesInStoreAfterModify(id: string, changes: Expense): void {
    const updatedExpenses = this.expensesStore.state.expenses.map(expense => {
      if (expense.id === id) {
        expense = changes;
      }
      return expense;
    });
    this.expensesStore.setPartialState<Expense[]>('expense', updatedExpenses);
  }

}
