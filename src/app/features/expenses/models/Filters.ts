import { FinanceTypeEnum, ExpenseCategory } from '../../../core/models/Expense';

export interface Filters {
  type: 'all' | FinanceTypeEnum;
  startDate: Date;
  endDate: Date;
  category: ExpenseCategory | null;
}
