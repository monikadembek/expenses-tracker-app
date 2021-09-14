import { ExpenseCategory } from './ExpenseCategory';

export interface Filters {
  startDate: Date;
  endDate: Date;
  category: ExpenseCategory | null;
}
