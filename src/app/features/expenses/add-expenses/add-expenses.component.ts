import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
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

  get expenseTitle(): AbstractControl {
    return this.addExpenseForm.get('expenseTitle');
  }

  get expenseValue(): AbstractControl {
    return this.addExpenseForm.get('value');
  }

  get expenseDate(): AbstractControl {
    return this.addExpenseForm.get('date');
  }

  get expenseCategory(): AbstractControl {
    return this.addExpenseForm.get('category');
  }

  get isTitleValid(): boolean {
    return this.expenseTitle.dirty && this.expenseTitle.valid;
  }

  get isValueValid(): boolean {
    return this.expenseValue.dirty && this.expenseValue.valid;
  }

  get isDateValid(): boolean {
    return this.expenseDate.dirty && this.expenseDate.valid;
  }

  get isCategoryValid(): boolean {
    return this.expenseCategory.dirty && this.expenseCategory.valid;
  }

  constructor(private expensesService: ExpensesService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.addExpenseForm = this.fb.group({
      expenseTitle: ['', [Validators.required]],
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
        // date: new Date(form.value.date)
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

  getErrorMsg(control: string): string {
    let errorMsg = '';
    switch (control) {
      case 'expenseTitle':
        if (!this.isTitleValid) {
          errorMsg = 'Please enter title of expense';
        }
        break;
      case 'value':
        if (!this.isValueValid && this.expenseValue.errors?.required) {
          errorMsg = 'Please enter value of expense';
        }
        if (!this.isValueValid && this.expenseValue.errors?.min) {
          errorMsg = 'Value can\'t be less than 0';
        }
        break;
      case 'date':
        if (!this.isDateValid) {
          errorMsg = 'Please enter date';
        }
        break;
      case 'category':
        if (!this.isCategoryValid) {
          errorMsg = 'Please select category';
        }
        break;
      default:
        errorMsg = '';
    }
    return errorMsg;
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
