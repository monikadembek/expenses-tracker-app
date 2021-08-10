import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import { Expense } from '../models/Expense';
import { ExpenseCategory } from '../models/ExpenseCategory';

@Component({
  selector: 'app-modify-expense-form',
  templateUrl: './modify-expense-form.component.html',
  styleUrls: ['./modify-expense-form.component.scss']
})
export class ModifyExpenseFormComponent implements OnInit {
  form: FormGroup;
  categories = ExpenseCategory;

  @Input() expense: Expense;
  @Output() cancelFormChanges: EventEmitter<void> = new EventEmitter<void>();

  get expenseTitle(): AbstractControl {
    return this.form.get('title');
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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: [this.expense.title, [Validators.required]],
      value: [this.expense.value, [Validators.required, Validators.min(0)]],
      date: [this.prepareDateInputFormat(this.expense.date), [Validators.required]],
      category: [this.expense.category, [Validators.required]]
    });
  }

  private prepareDateInputFormat(date: firebase.firestore.Timestamp): string {
    const jsDateFormat = date.toDate(); // convert from firebase timestamp to js date format
    const dateInput = jsDateFormat.toLocaleString().split(',')[0].split('.');
    dateInput[0] = +dateInput[0] < 10 ? `0${dateInput[0]}` : dateInput[0];
    dateInput.reverse();
    return dateInput.join('-');
  }


  save(form: FormGroup): void {
    console.log('save modified form', form);
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

}
