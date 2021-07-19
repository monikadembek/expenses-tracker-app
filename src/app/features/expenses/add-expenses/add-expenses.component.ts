import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../models/Expense';
import { ExpenseCategory } from '../models/ExpenseCategory';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent implements OnInit, OnDestroy {
  addExpenseForm: FormGroup;
  categories = ExpenseCategory;
  unSubscribe$: Subject<void> = new Subject();

  initialDate = new Date().toLocaleString().split(',')[0].split('.').reverse().join('-');

  initialFormData: any = {
    expenseTitle: '',
    value: 0,
    date: this.initialDate,
    category: 'other'
  };

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(private expensesService: ExpensesService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.addExpenseForm = this.fb.group({
      expenseTitle: ['', [Validators.required, Validators.minLength(2)]],
      value: [0, [Validators.required, Validators.min(0)]],
      date: [this.initialDate, [Validators.required]],
      category: ['other', [Validators.required]]
    });
  }

  save(form: FormGroup): void {
    console.log('form', form.value);
    if (form.dirty && form.valid) {
      const expense: Expense = {
        ...form.value,
        date: new Date(form.value.date)
      };
      this.expensesService.addExpense(expense)
        .pipe(takeUntil(this.unSubscribe$))
        .subscribe(data => {
          console.log('data from add do db', data);
          if (data) {
            this.formDirective.resetForm(this.initialFormData);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
