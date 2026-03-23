import type { Transaction, DailyRegister, DailySummary } from "./dashboard.types";

const TRANSACTIONS_KEY = "tedeset_transactions";
const REGISTERS_KEY = "tedeset_registers";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// --- Transactions ---

export function getTransactions(date?: string): Transaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  const all: Transaction[] = raw ? JSON.parse(raw) : [];
  if (!date) return all;
  return all.filter((t) => t.timestamp.startsWith(date));
}

export function addTransaction(
  data: Omit<Transaction, "id" | "timestamp">
): Transaction {
  const txn: Transaction = {
    ...data,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  const all = getTransactions();
  all.push(txn);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(all));
  return txn;
}

export function deleteTransaction(id: string): void {
  const all = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(all));
}

// --- Register ---

export function getRegister(date?: string): DailyRegister | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REGISTERS_KEY);
  const all: DailyRegister[] = raw ? JSON.parse(raw) : [];
  const d = date || todayStr();
  return all.find((r) => r.date === d) || null;
}

export function openRegister(openingBalance: number, date?: string): DailyRegister {
  const d = date || todayStr();
  const raw = localStorage.getItem(REGISTERS_KEY);
  const all: DailyRegister[] = raw ? JSON.parse(raw) : [];
  const existing = all.findIndex((r) => r.date === d);
  const reg: DailyRegister = {
    date: d,
    openingBalance,
    closingBalance: null,
    isClosed: false,
  };
  if (existing >= 0) {
    all[existing] = reg;
  } else {
    all.push(reg);
  }
  localStorage.setItem(REGISTERS_KEY, JSON.stringify(all));
  return reg;
}

export function closeRegister(closingBalance: number, date?: string): DailyRegister | null {
  const d = date || todayStr();
  const raw = localStorage.getItem(REGISTERS_KEY);
  const all: DailyRegister[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex((r) => r.date === d);
  if (idx < 0) return null;
  all[idx].closingBalance = closingBalance;
  all[idx].isClosed = true;
  localStorage.setItem(REGISTERS_KEY, JSON.stringify(all));
  return all[idx];
}

// --- Summary ---

export function getDailySummary(date?: string): DailySummary {
  const d = date || todayStr();
  const txns = getTransactions(d);
  const register = getRegister(d);

  const totalCash = txns
    .filter((t) => t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCard = txns
    .filter((t) => t.paymentMethod === "card")
    .reduce((sum, t) => sum + t.amount, 0);
  const cashCount = txns.filter((t) => t.paymentMethod === "cash").length;
  const cardCount = txns.filter((t) => t.paymentMethod === "card").length;

  const openingBalance = register?.openingBalance ?? 0;
  const expectedCash = openingBalance + totalCash;
  const variance =
    register?.closingBalance !== null && register?.closingBalance !== undefined
      ? register.closingBalance - expectedCash
      : null;

  return {
    date: d,
    totalCash,
    totalCard,
    grandTotal: totalCash + totalCard,
    cashCount,
    cardCount,
    totalCount: cashCount + cardCount,
    openingBalance,
    closingBalance: register?.closingBalance ?? null,
    expectedCash,
    variance,
  };
}
