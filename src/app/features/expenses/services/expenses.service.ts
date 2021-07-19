import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../models/Expense';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../../../auth/services/auth.service';
import { DataAccessService } from '../../../core/services/data-access.service';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  // get userId(): string {
  //   return this.authService.userId;
  // }

  constructor(private authService: AuthService,
              private dataAccessService: DataAccessService) { }

  addExpense(expense: Partial<Expense>): Observable<DocumentReference<unknown> | string> {
    let expenseData = null;
    return this.authService.user$.pipe(
      map(data => {
        expenseData = {
          ...expense,
          uid: data.uid
        };
        console.log('*expenseData', expenseData);
        return expenseData;
      }),
      concatMap(data => this.dataAccessService.addExpenseToDb(data))
    );
  }

}
