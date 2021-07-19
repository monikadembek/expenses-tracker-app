import { ExpenseCategory } from './ExpenseCategory';

export interface Expense {
  title: string;
  value: number;
  date: Date;
  category: ExpenseCategory;
  uid: string;
}
