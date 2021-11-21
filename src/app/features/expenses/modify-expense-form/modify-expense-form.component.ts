import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarMessageType } from 'src/app/shared/shared-models';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Expense, FinanceTypeEnum, ExpenseCategory } from '../../../core/models/Expense';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-modify-expense-form',
  templateUrl: './modify-expense-form.component.html',
  styleUrls: ['./modify-expense-form.component.scss']
})
export class ModifyExpenseFormComponent implements OnInit, OnDestroy {

  unSubscribe$: Subject<void> = new Subject();
  form: FormGroup;
  categories = ExpenseCategory;

  @Input() expense: Expense;
  @Output() cancelFormChanges: EventEmitter<void> = new EventEmitter<void>();
  @Output() expenseUpdated: EventEmitter<void> = new EventEmitter<void>();

  get expenseTitle(): AbstractControl {
    return this.form.get('title');
  }

  get expenseType(): AbstractControl {
    return this.form.get('type');
  }

  get expenseValue(): AbstractControl {
    return this.form.get('value');
  }

  get expenseDate(): AbstractControl {
    return this.form.get('date');
  }

  get expenseCategory(): AbstractControl {
    return this.form.get('category');
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
    return this.form.get('type').value === FinanceTypeEnum.EXPENSE;
  }

  constructor(private fb: FormBuilder,
              private expensesService: ExpensesService,
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
    this.form = this.fb.group({
      title: [this.expense.title, [Validators.required]],
      type: [this.expense.type, [Validators.required]],
      value: [this.expense.value, [Validators.required, Validators.min(0)]],
      date: [this.prepareDateInputFormat(this.expense.date), [Validators.required]],
      category: [this.expense.category]
    });
  }

  private prepareDateInputFormat(date: firebase.firestore.Timestamp): string {
    const jsDateFormat = date.toDate(); // convert from firebase timestamp to js date format
    const dateInput = jsDateFormat.toLocaleString().split(',')[0].split('.');
    dateInput[0] = +dateInput[0] < 10 ? `0${dateInput[0]}` : dateInput[0];
    dateInput.reverse();
    return dateInput.join('-');
  }

  update(form: FormGroup): void {
    console.log('save modified form', form);
    if (form.dirty && form.valid) {
      const timestampDate = firebase.firestore.Timestamp.fromDate(new Date(form.value.date));
      const expense: Expense = {
        ...form.value,
        date: timestampDate
      };
      console.log('modified expense', expense);
      this.expensesService.modifyExpense(this.expense.id, expense)
        .pipe(takeUntil(this.unSubscribe$))
        .subscribe(data => {
          console.log('data updated in db', data);
          if (data) {
            if (typeof data === 'object') {
              console.log('update expenses list');
              this.expenseUpdated.emit();
              this.snackbarService.displaySnackbarMessage('Expense has been modified', SnackbarMessageType.Success);
            }
            console.log(typeof data);
            this.cancel();
          }
        });
    }
  }

  cancel(): void {
    this.cancelFormChanges.emit();
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
