export type PaymentMethod = "cash" | "card";

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  category: string;
}

export interface DailyRegister {
  date: string;
  openingBalance: number;
  closingBalance: number | null;
  isClosed: boolean;
}

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
}
