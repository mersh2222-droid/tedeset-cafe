export type PaymentMethod = "cash" | "card";

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  category: string;
  shiftId?: string;
}

// --- Ledger ---

export type LedgerEntryType = "expense" | "income";

export type ExpenseCategory =
  | "Supplies"
  | "Bills/Utilities"
  | "Ingredients"
  | "Maintenance"
  | "Delivery Cost"
  | "Loan"
  | "Other";

export type IncomeCategory =
  | "Investment"
  | "Loan Received"
  | "Refund Received"
  | "Other";

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: LedgerEntryType;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  description: string;
}

export interface LedgerSummary {
  totalExpenses: number;
  totalIncome: number;
  netCashFlow: number;
  expenseCount: number;
  incomeCount: number;
}

// --- Shifts ---

export interface Shift {
  id: string;
  date: string;
  name: string;
  openedAt: string;
  closedAt: string | null;
  openingBalance: number;
  closingBalance: number | null;
  isClosed: boolean;
  order: number;
}

export interface ShiftSummary {
  shiftId: string;
  shiftName: string;
  totalCash: number;
  totalCard: number;
  grandTotal: number;
  transactionCount: number;
  openingBalance: number;
  closingBalance: number | null;
  variance: number | null;
}

// --- Register ---

export interface DailyRegister {
  date: string;
  openingBalance: number;
  closingBalance: number | null;
  isClosed: boolean;
}

// --- Summary ---

export interface DailySummary {
  date: string;
  totalCash: number;
  totalCard: number;
  grandTotal: number;
  cashCount: number;
  cardCount: number;
  totalCount: number;
  openingBalance: number;
  closingBalance: number | null;
  expectedCash: number;
  variance: number | null;
  ledgerExpenses: number;
  ledgerIncome: number;
  netCashFlow: number;
  adjustedCash: number;
  shifts?: ShiftSummary[];
}

// --- Quick-Add Presets ---

export interface QuickAddPreset {
  id: string;
  label: string;
  amount: number;
  paymentMethod: PaymentMethod;
  category: string;
  description: string;
}

// --- Reports ---

export interface DateRange {
  from: string;
  to: string;
}

export interface DailyReportRow {
  date: string;
  totalCash: number;
  totalCard: number;
  grandTotal: number;
  transactionCount: number;
  ledgerExpenses: number;
  ledgerIncome: number;
  netRevenue: number;
}

export interface RangeSummary {
  dateRange: DateRange;
  rows: DailyReportRow[];
  totals: DailyReportRow;
  averageDailyRevenue: number;
  busiestDay: { date: string; total: number } | null;
  slowestDay: { date: string; total: number } | null;
}

// --- Sort ---

export type TransactionSortField = "timestamp" | "amount" | "paymentMethod";
export type SortDirection = "asc" | "desc";
