import { FinanceTypeEnum } from './Expense';
import { ExpenseCategory } from './ExpenseCategory';

export interface Filters {
  type: 'all' | FinanceTypeEnum;
  startDate: Date;
  endDate: Date;
  category: ExpenseCategory | null;
}
