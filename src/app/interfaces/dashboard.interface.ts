export interface DashboardResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categorySummaries: CategorySummary[];
  monthlySummaries: MonthlySummary[];
  accountBalances: Record<string, number>;
}

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  total: number;
  type: 'INCOME' | 'EXPENSE';
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
} 