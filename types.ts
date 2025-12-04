export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string; // ISO string
}

export interface Share {
  id: string;
  name: string;
  code: string;
  units: number;
  buyPrice: number;
  buyDate: string;
  dividendDate?: string;
  dividendAmount?: number;
  currentPrice: number;
}

export interface Fund {
  id: string;
  name: string;
  buyDate: string;
  amountInvested: number;
  currentValue: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  PARENTS = 'PARENTS',
  PORTFOLIO = 'PORTFOLIO',
  ADD = 'ADD',
  STATS = 'STATS',
  INSIGHTS = 'INSIGHTS',
}

export interface ExpenseSummary {
  category: string;
  amount: number;
  color: string;
}

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gift',
  'Sibling Contribution',
  'Other'
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Breakfast',
  'Brunch',
  'Dinner',
  'Groceries',
  'Transport',
  'Fuel',
  'Public Transit',
  'Bills & Utilities',
  'Phone Bill',
  'Insurance',
  'Rent/Mortgage',
  'Personal',
  'Parents',
  'Shopping',
  'Saving',
  'Health',
  'Entertainment',
  'Other'
];

export const PARENT_RELATED_CATEGORIES = [
  'Parents',
  'Sibling Contribution'
];