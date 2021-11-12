import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Filters } from '../models/Filters';
import { ExpenseCategory } from '../models/ExpenseCategory';
import { FinanceTypeEnum } from '../models/Expense';

@Component({
  selector: 'filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss']
})
export class FiltersFormComponent implements OnInit {

  @Input() filters: Filters;
  @Output() filtersSet: EventEmitter<Filters> = new EventEmitter<any>();

  form: FormGroup;
  categories = ExpenseCategory;
  shoulDisplayCategorySelect = true;

  get isStartDateValid(): boolean {
    return this.form.controls.startDate.valid;
  }

  get isEndDateValid(): boolean {
    return this.form.controls.endDate.valid;
  }

  get shouldShowFormErrors(): boolean {
    return this.form.invalid && this.form.errors?.invalidDates;
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      type: [this.filters.type, [Validators.required]],
      startDate: [this.filters.startDate, Validators.required],
      endDate: [this.filters.endDate, Validators.required],
      category: [this.filters.category]
    }, {
      validators: [this.checkDatesValidity()],
      updateOn: 'blur'
    });
  }

  checkDatesValidity(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
      const from = form.get('startDate').value;
      const to = form.get('endDate').value;
      if (from && to) {
        if (from.getTime() < to.getTime()) {
          return { invalidDates: true };
        }
      }
      return null;
    };
  }

  getErrorMessage(field: string = null): string {
    let errorMsg = '';
    if (field === 'startDate') {
      if (this.form.controls.startDate.errors?.matDatepickerParse) {
        errorMsg = 'Wrong date format, it should be mm/dd/yyyy';
      } else if (this.form.controls.startDate.errors?.required) {
        errorMsg = 'Date is required';
      }
    } else if (field === 'endDate') {
      if (this.form.controls.endDate.errors?.matDatepickerParse) {
        errorMsg = 'Wrong date format, it should be mm/dd/yyyy';
      } else if (this.form.controls.endDate.errors?.required) {
        errorMsg = 'Date is required';
      }
    } else if (this.form.errors?.invalidDates && field === null) {
      errorMsg = '"To date" should be before "From date"';
    }

    return errorMsg;
  }

  onExpenseTypeChange(event: MatRadioChange): void {
    if (event.value === FinanceTypeEnum.INCOME) {
      this.shoulDisplayCategorySelect = false;
    } else {
      this.shoulDisplayCategorySelect = true;
    }
  }

  submit(form: FormGroup): void {
    console.log(form);
    const filters: Filters = this.form.value;
    this.filtersSet.emit(filters);
  }
}
