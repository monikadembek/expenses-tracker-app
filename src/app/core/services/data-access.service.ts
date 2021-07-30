import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap, first } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Expense } from '../../features/expenses/models/Expense';
import { ExpensesStore } from 'src/app/features/expenses/services/expenses-store';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private afs: AngularFirestore,
              private expensesStore: ExpensesStore) { }

  addExpenseToDb(expense: Partial<Expense>): Observable<DocumentReference<unknown>> | Observable<any> {
    return from(this.afs.collection('expenses').add(expense))
      .pipe(catchError(error => of(`Error occured: ${error}`)));
  }

  getExpensesFromDb(uid: string): Observable<Expense[]> {
    return this.afs.collection<Expense>('expenses', ref => ref.where('uid', '==', uid).orderBy('date', 'desc')).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            let expense: Expense;
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            expense = {id, ...data};
            return expense;
          });
        }),
        first(),
        tap(expenses => this.expensesStore.setPartialState<Expense[]>('expenses', expenses)),
        tap(() => console.log('expenses store:', this.expensesStore.state))
      );
  }

  deleteExpenseFromDb(id: string): Promise<void> {
    return this.afs.doc(`expenses/${id}`).delete();
  }

}
