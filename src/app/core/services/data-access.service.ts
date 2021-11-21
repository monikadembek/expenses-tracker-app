import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap, first } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Expense } from '../models/Expense';
import { ExpensesStore } from '../services/expenses-store';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private afs: AngularFirestore,
              private expensesStore: ExpensesStore) { }

  addExpenseToDb(expense: Partial<Expense>): Observable<DocumentReference<unknown>> | Observable<any> {
    return from(this.afs.collection('expenses').add(expense))
      .pipe(catchError(error => of(`Error occured while saving new expense: ${error}`)));
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

  updateExpenseInDb(id: string, changes: Expense): Promise<void> {
    return this.afs.doc(`expenses/${id}`).update(changes);
  }

}
