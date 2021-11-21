export enum ExpenseCategory {
  bills = 'Bills',
  rent = 'Rent',
  food = 'Food',
  groceries = 'Groceries',
  entertainment = 'Entertainment',
  subscriptions = 'Subscriptions',
  pet = 'Pet',
  health = 'Health',
  travel = 'Travel',
  commute = 'Commute',
  shopping = 'Shopping',
  education = 'Education',
  other = 'Other'
}

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
