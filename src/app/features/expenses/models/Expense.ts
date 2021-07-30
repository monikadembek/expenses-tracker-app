import { ExpenseCategory } from './ExpenseCategory';

export interface Expense {
  id?: string;
  title: string;
  value: number;
  date: any;
  category: ExpenseCategory;
  uid: string;
}
