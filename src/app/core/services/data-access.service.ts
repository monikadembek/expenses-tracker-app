import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Expense } from '../../features/expenses/models/Expense';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private afs: AngularFirestore) { }

  addExpenseToDb(expense: Partial<Expense>): Observable<DocumentReference<unknown>> | Observable<any> {
    return from(this.afs.collection('expenses').add(expense))
      .pipe(catchError(error => of(`Error occured: ${error}`)));
  }

}
