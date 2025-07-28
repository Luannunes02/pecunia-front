export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  transactionDate: string;
  dueDate?: string;
  isPaid: boolean;
  isRecurring: boolean;
  recurringFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  accountId: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  account?: Account;
  category?: Category;
  destinationAccountId?: number;
  destinationAccount?: Account;
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategorySummary {
  categoryName: string;
  categoryType: CategoryType;
  total: number;
  colorHex: string | null;
}

export interface MonthlySummary {
  month: string; // 'MM/YYYY'
  income: number;
  expense: number;
  balance: number;
}

export interface Dashboard {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  categorySummaries: CategorySummary[];
  monthlySummaries: MonthlySummary[];
  accountBalances: Record<string, number>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  category: Category;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Authority {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}
