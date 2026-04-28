import type {
  Transaction,
  DailyRegister,
  DailySummary,
  LedgerEntry,
  LedgerEntryType,
  LedgerSummary,
  Shift,
  ShiftSummary,
  QuickAddPreset,
  DailyReportRow,
  RangeSummary,
} from "./dashboard.types";

const TRANSACTIONS_KEY = "tedeset_transactions";
const REGISTERS_KEY = "tedeset_registers";
const LEDGER_KEY = "tedeset_ledger_entries";
const SHIFTS_KEY = "tedeset_shifts";
const PRESETS_KEY = "tedeset_quick_presets";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setAll<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// =========================================
// Transactions
// =========================================

export function getTransactions(date?: string): Transaction[] {
  const all = getAll<Transaction>(TRANSACTIONS_KEY);
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
  const all = getAll<Transaction>(TRANSACTIONS_KEY);
  all.push(txn);
  setAll(TRANSACTIONS_KEY, all);
  return txn;
}

export function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, "id">>
): Transaction | null {
  const all = getAll<Transaction>(TRANSACTIONS_KEY);
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...data };
  setAll(TRANSACTIONS_KEY, all);
  return all[idx];
}

export function deleteTransaction(id: string): void {
  const all = getAll<Transaction>(TRANSACTIONS_KEY).filter((t) => t.id !== id);
  setAll(TRANSACTIONS_KEY, all);
}

export function searchTransactions(date: string, query: string): Transaction[] {
  const q = query.toLowerCase();
  return getTransactions(date).filter(
    (t) =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}

// =========================================
// Register
// =========================================

export function getRegister(date?: string): DailyRegister | null {
  const all = getAll<DailyRegister>(REGISTERS_KEY);
  const d = date || todayStr();
  return all.find((r) => r.date === d) || null;
}

export function openRegister(
  openingBalance: number,
  date?: string
): DailyRegister {
  const d = date || todayStr();
  const all = getAll<DailyRegister>(REGISTERS_KEY);
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
  setAll(REGISTERS_KEY, all);
  return reg;
}

export function closeRegister(
  closingBalance: number,
  date?: string
): DailyRegister | null {
  const d = date || todayStr();
  const all = getAll<DailyRegister>(REGISTERS_KEY);
  const idx = all.findIndex((r) => r.date === d);
  if (idx < 0) return null;
  all[idx].closingBalance = closingBalance;
  all[idx].isClosed = true;
  setAll(REGISTERS_KEY, all);
  return all[idx];
}

// =========================================
// Ledger (Expenses & Income)
// =========================================

export function getLedgerEntries(date?: string): LedgerEntry[] {
  const all = getAll<LedgerEntry>(LEDGER_KEY);
  if (!date) return all;
  return all.filter((e) => e.timestamp.startsWith(date));
}

export function addLedgerEntry(
  data: Omit<LedgerEntry, "id" | "timestamp">
): LedgerEntry {
  const entry: LedgerEntry = {
    ...data,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  const all = getAll<LedgerEntry>(LEDGER_KEY);
  all.push(entry);
  setAll(LEDGER_KEY, all);
  return entry;
}

export function updateLedgerEntry(
  id: string,
  data: Partial<Omit<LedgerEntry, "id">>
): LedgerEntry | null {
  const all = getAll<LedgerEntry>(LEDGER_KEY);
  const idx = all.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...data };
  setAll(LEDGER_KEY, all);
  return all[idx];
}

export function deleteLedgerEntry(id: string): void {
  const all = getAll<LedgerEntry>(LEDGER_KEY).filter((e) => e.id !== id);
  setAll(LEDGER_KEY, all);
}

export function getLedgerSummary(date?: string): LedgerSummary {
  const entries = getLedgerEntries(date);
  const expenses = entries.filter((e) => e.type === "expense");
  const income = entries.filter((e) => e.type === "income");
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  return {
    totalExpenses,
    totalIncome,
    netCashFlow: totalIncome - totalExpenses,
    expenseCount: expenses.length,
    incomeCount: income.length,
  };
}

// =========================================
// Shifts
// =========================================

export function getShifts(date?: string): Shift[] {
  const all = getAll<Shift>(SHIFTS_KEY);
  if (!date) return all;
  return all.filter((s) => s.date === date).sort((a, b) => a.order - b.order);
}

export function openShift(data: {
  date: string;
  name: string;
  openingBalance: number;
  order: number;
}): Shift {
  const shift: Shift = {
    id: generateId(),
    date: data.date,
    name: data.name,
    openedAt: new Date().toISOString(),
    closedAt: null,
    openingBalance: data.openingBalance,
    closingBalance: null,
    isClosed: false,
    order: data.order,
  };
  const all = getAll<Shift>(SHIFTS_KEY);
  all.push(shift);
  setAll(SHIFTS_KEY, all);
  return shift;
}

export function closeShift(
  shiftId: string,
  closingBalance: number
): Shift | null {
  const all = getAll<Shift>(SHIFTS_KEY);
  const idx = all.findIndex((s) => s.id === shiftId);
  if (idx < 0) return null;
  all[idx].closingBalance = closingBalance;
  all[idx].isClosed = true;
  all[idx].closedAt = new Date().toISOString();
  setAll(SHIFTS_KEY, all);
  return all[idx];
}

export function getActiveShift(date?: string): Shift | null {
  const shifts = getShifts(date || todayStr());
  return shifts.find((s) => !s.isClosed) || null;
}

export function getShiftSummary(shiftId: string): ShiftSummary {
  const all = getAll<Shift>(SHIFTS_KEY);
  const shift = all.find((s) => s.id === shiftId);
  if (!shift) {
    return {
      shiftId,
      shiftName: "",
      totalCash: 0,
      totalCard: 0,
      grandTotal: 0,
      transactionCount: 0,
      openingBalance: 0,
      closingBalance: null,
      variance: null,
    };
  }

  const txns = getTransactions(shift.date).filter(
    (t) => t.shiftId === shiftId
  );
  const totalCash = txns
    .filter((t) => t.paymentMethod === "cash")
    .reduce((s, t) => s + t.amount, 0);
  const totalCard = txns
    .filter((t) => t.paymentMethod === "card")
    .reduce((s, t) => s + t.amount, 0);
  const expectedCash = shift.openingBalance + totalCash;

  return {
    shiftId,
    shiftName: shift.name,
    totalCash,
    totalCard,
    grandTotal: totalCash + totalCard,
    transactionCount: txns.length,
    openingBalance: shift.openingBalance,
    closingBalance: shift.closingBalance,
    variance:
      shift.closingBalance !== null ? shift.closingBalance - expectedCash : null,
  };
}

// =========================================
// Quick-Add Presets
// =========================================

export function getQuickPresets(): QuickAddPreset[] {
  return getAll<QuickAddPreset>(PRESETS_KEY);
}

export function saveQuickPreset(
  data: Omit<QuickAddPreset, "id">
): QuickAddPreset {
  const preset: QuickAddPreset = { ...data, id: generateId() };
  const all = getAll<QuickAddPreset>(PRESETS_KEY);
  all.push(preset);
  setAll(PRESETS_KEY, all);
  return preset;
}

export function deleteQuickPreset(id: string): void {
  const all = getAll<QuickAddPreset>(PRESETS_KEY).filter((p) => p.id !== id);
  setAll(PRESETS_KEY, all);
}

// =========================================
// Daily Summary (enhanced)
// =========================================

export function getDailySummary(date?: string): DailySummary {
  const d = date || todayStr();
  const txns = getTransactions(d);
  const register = getRegister(d);
  const ledger = getLedgerSummary(d);
  const shifts = getShifts(d);

  const totalCash = txns
    .filter((t) => t.paymentMethod === "cash")
    .reduce((s, t) => s + t.amount, 0);
  const totalCard = txns
    .filter((t) => t.paymentMethod === "card")
    .reduce((s, t) => s + t.amount, 0);
  const cashCount = txns.filter((t) => t.paymentMethod === "cash").length;
  const cardCount = txns.filter((t) => t.paymentMethod === "card").length;

  const openingBalance = register?.openingBalance ?? 0;
  const expectedCash = openingBalance + totalCash;
  const adjustedCash = expectedCash - ledger.totalExpenses + ledger.totalIncome;
  const variance =
    register?.closingBalance !== null && register?.closingBalance !== undefined
      ? register.closingBalance - expectedCash
      : null;

  const shiftSummaries =
    shifts.length > 0
      ? shifts.map((s) => getShiftSummary(s.id))
      : undefined;

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
    ledgerExpenses: ledger.totalExpenses,
    ledgerIncome: ledger.totalIncome,
    netCashFlow: ledger.netCashFlow,
    adjustedCash,
    shifts: shiftSummaries,
  };
}

// =========================================
// Reports
// =========================================

function getDatesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function getRangeSummary(from: string, to: string): RangeSummary {
  const dates = getDatesInRange(from, to);
  const rows: DailyReportRow[] = dates.map((d) => {
    const txns = getTransactions(d);
    const ledger = getLedgerSummary(d);
    const totalCash = txns
      .filter((t) => t.paymentMethod === "cash")
      .reduce((s, t) => s + t.amount, 0);
    const totalCard = txns
      .filter((t) => t.paymentMethod === "card")
      .reduce((s, t) => s + t.amount, 0);
    const grandTotal = totalCash + totalCard;
    return {
      date: d,
      totalCash,
      totalCard,
      grandTotal,
      transactionCount: txns.length,
      ledgerExpenses: ledger.totalExpenses,
      ledgerIncome: ledger.totalIncome,
      netRevenue: grandTotal - ledger.totalExpenses + ledger.totalIncome,
    };
  });

  const totals: DailyReportRow = {
    date: `${from} to ${to}`,
    totalCash: rows.reduce((s, r) => s + r.totalCash, 0),
    totalCard: rows.reduce((s, r) => s + r.totalCard, 0),
    grandTotal: rows.reduce((s, r) => s + r.grandTotal, 0),
    transactionCount: rows.reduce((s, r) => s + r.transactionCount, 0),
    ledgerExpenses: rows.reduce((s, r) => s + r.ledgerExpenses, 0),
    ledgerIncome: rows.reduce((s, r) => s + r.ledgerIncome, 0),
    netRevenue: rows.reduce((s, r) => s + r.netRevenue, 0),
  };

  const activeDays = rows.filter((r) => r.transactionCount > 0);
  const averageDailyRevenue =
    activeDays.length > 0
      ? activeDays.reduce((s, r) => s + r.grandTotal, 0) / activeDays.length
      : 0;

  let busiestDay: { date: string; total: number } | null = null;
  let slowestDay: { date: string; total: number } | null = null;
  for (const r of activeDays) {
    if (!busiestDay || r.grandTotal > busiestDay.total) {
      busiestDay = { date: r.date, total: r.grandTotal };
    }
    if (!slowestDay || r.grandTotal < slowestDay.total) {
      slowestDay = { date: r.date, total: r.grandTotal };
    }
  }

  return {
    dateRange: { from, to },
    rows,
    totals,
    averageDailyRevenue,
    busiestDay,
    slowestDay,
  };
}

export function exportRangeToCSV(from: string, to: string): string {
  const summary = getRangeSummary(from, to);
  const header =
    "Date,Cash Sales,Card Sales,Total Sales,Transactions,Expenses,Income,Net Revenue";
  const dataRows = summary.rows.map(
    (r) =>
      `${r.date},${r.totalCash.toFixed(2)},${r.totalCard.toFixed(2)},${r.grandTotal.toFixed(2)},${r.transactionCount},${r.ledgerExpenses.toFixed(2)},${r.ledgerIncome.toFixed(2)},${r.netRevenue.toFixed(2)}`
  );
  const totalRow = `TOTAL,${summary.totals.totalCash.toFixed(2)},${summary.totals.totalCard.toFixed(2)},${summary.totals.grandTotal.toFixed(2)},${summary.totals.transactionCount},${summary.totals.ledgerExpenses.toFixed(2)},${summary.totals.ledgerIncome.toFixed(2)},${summary.totals.netRevenue.toFixed(2)}`;
  return [header, ...dataRows, totalRow].join("\n");
}
