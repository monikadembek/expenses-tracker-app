import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarMessageType } from 'src/app/shared/shared-models';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Expense, FinanceTypeEnum, ExpenseCategory } from '../../../core/models/Expense';
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

  initialDate = this.prepareDateInputFormat(new Date());

  initialFormData: any = {
    title: '',
    type: FinanceTypeEnum.EXPENSE,
    value: 0,
    date: this.initialDate,
    category: 'other'
  };

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  get expenseTitle(): AbstractControl {
    return this.addExpenseForm.get('title');
  }

  get expenseType(): AbstractControl {
    return this.addExpenseForm.get('type');
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

  get shouldDisplayCategory(): boolean {
    return this.addExpenseForm.get('type').value === FinanceTypeEnum.EXPENSE;
  }

  constructor(private expensesService: ExpensesService,
              private fb: FormBuilder,
              private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.buildForm();
    this.expenseType.valueChanges
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(value => {
        if (value === FinanceTypeEnum.INCOME) {
          this.expenseCategory.setValue(null);
        } else {
          this.expenseCategory.setValue('other');
        }
      });
  }

  private buildForm(): void {
    this.addExpenseForm = this.fb.group({
      title: ['', [Validators.required]],
      type: [FinanceTypeEnum.EXPENSE, [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      date: [this.initialDate, [Validators.required]],
      category: ['other']
    });
  }

  private prepareDateInputFormat(date: Date): string {
    const dateInput = date.toLocaleString().split(',')[0].split('.');
    dateInput[0] = +dateInput[0] < 10 ? `0${dateInput[0]}` : dateInput[0];
    dateInput.reverse();
    return dateInput.join('-');
  }

  save(form: FormGroup): void {
    console.log('form', form.value);
    if (form.dirty && form.valid) {
      const timestampDate = firebase.default.firestore.Timestamp.fromDate(new Date(form.value.date));
      const expense: Expense = {
        ...form.value,
        date: timestampDate
      };
      this.expensesService.addExpense(expense)
        .pipe(takeUntil(this.unSubscribe$))
        .subscribe(data => {
          console.log('form in subscribe', form.value);
          this.snackbarService.displaySnackbarMessage(this.getSnackbarMessage(form.value.type), SnackbarMessageType.Success);
          this.formDirective.resetForm(this.initialFormData);
        });
    }
  }

  private getSnackbarMessage(type: string): string {
    return type[0].toUpperCase() + type.slice(1) + ' has been added';
  }

  getErrorMsg(control: string): string {
    let errorMsg = '';
    switch (control) {
      case 'title':
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
