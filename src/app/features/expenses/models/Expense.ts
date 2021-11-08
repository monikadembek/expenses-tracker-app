import { ExpenseCategory } from './ExpenseCategory';

export enum FinanceTypeEnum {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export interface Expense {
  id?: string;
  type: FinanceTypeEnum;
  title: string;
  value: number;
  date: any;
  category?: ExpenseCategory;
  uid: string;
}
