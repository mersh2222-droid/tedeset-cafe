"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Transaction {
  time: string;
  type: string;
  location: string;
  amount: number | "";
  note: string;
}

interface DayRecord {
  date: string;
  shift: string;
  cashier: string;
  manager: string;
  openingDrawer: number;
  openingSafe: number;
  posCashSales: number;
  posCardSales: number;
  posEbtSales: number;
  posOnlineSales: number;
  posGiftCardSales: number;
  posNote: string;
  actualDrawer: number;
  actualSafe: number;
  dailyNotes: string;
  signCashier: string;
  signManager: string;
  transactions: Transaction[];
}

interface Store {
  storeName: string;
  storeAddress: string;
  records: Record<string, DayRecord>;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const APP_KEY = "tedeset_cash_control_app_v1";
const TX_TYPES = [
  "Paid Out",
  "Cash Refund",
  "Safe Drop",
  "Safe to Drawer",
  "Bank Deposit",
  "Bank Cash In",
  "Other Cash In",
  "Other Cash Out",
] as const;
const LOCATIONS = ["Drawer", "Safe"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0
  );
const money = (v: string | number | "") => Number.parseFloat(String(v || 0)) || 0;
const todayISO = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

function defaultRecord(date: string): DayRecord {
  return {
    date,
    shift: "Morning",
    cashier: "",
    manager: "",
    openingDrawer: 300,
    openingSafe: 0,
    posCashSales: 0,
    posCardSales: 0,
    posEbtSales: 0,
    posOnlineSales: 0,
    posGiftCardSales: 0,
    posNote: "",
    actualDrawer: 0,
    actualSafe: 0,
    dailyNotes: "",
    signCashier: "",
    signManager: "",
    transactions: [],
  };
}

function loadStore(): Store {
  if (typeof window === "undefined")
    return { storeName: "Tedeset Market and Cafe", storeAddress: "10240 NE Halsey Street, Portland, OR", records: {} };
  const raw = localStorage.getItem(APP_KEY);
  if (!raw)
    return { storeName: "Tedeset Market and Cafe", storeAddress: "10240 NE Halsey Street, Portland, OR", records: {} };
  try {
    const p = JSON.parse(raw);
    return {
      storeName: p.storeName || "Tedeset Market and Cafe",
      storeAddress: p.storeAddress || "",
      records: p.records || {},
    };
  } catch {
    return { storeName: "Tedeset Market and Cafe", storeAddress: "", records: {} };
  }
}

/* ------------------------------------------------------------------ */
/*  Calculation logic                                                  */
/* ------------------------------------------------------------------ */
function txTotals(rec: DayRecord) {
  let drawer = 0, safe = 0, inTotal = 0, outTotal = 0;
  let bankDeposit = 0, bankCashIn = 0, safeDrop = 0, payoutRefund = 0;
  for (const tx of rec.transactions) {
    const amt = money(tx.amount);
    if (!amt) continue;
    const loc = tx.location || "Drawer";
    switch (tx.type) {
      case "Paid Out":
      case "Cash Refund":
      case "Other Cash Out":
        if (loc === "Drawer") drawer -= amt; else safe -= amt;
        outTotal += amt;
        if (tx.type === "Paid Out" || tx.type === "Cash Refund") payoutRefund += amt;
        break;
      case "Safe Drop":
        drawer -= amt; safe += amt; safeDrop += amt;
        break;
      case "Safe to Drawer":
        safe -= amt; drawer += amt;
        break;
      case "Bank Deposit":
        if (loc === "Drawer") drawer -= amt; else safe -= amt;
        outTotal += amt; bankDeposit += amt;
        break;
      case "Bank Cash In":
        if (loc === "Drawer") drawer += amt; else safe += amt;
        inTotal += amt; bankCashIn += amt;
        break;
      case "Other Cash In":
        if (loc === "Drawer") drawer += amt; else safe += amt;
        inTotal += amt;
        break;
    }
  }
  return { drawer, safe, overallIn: inTotal, overallOut: outTotal, bankDeposit, bankCashIn, safeDrop, payoutRefund };
}

function calcRecord(rec: DayRecord) {
  const opDraw = money(rec.openingDrawer);
  const opSafe = money(rec.openingSafe);
  const cashSales = money(rec.posCashSales);
  const card = money(rec.posCardSales);
  const ebt = money(rec.posEbtSales);
  const online = money(rec.posOnlineSales);
  const gift = money(rec.posGiftCardSales);
  const tx = txTotals(rec);
  const expectedDrawer = opDraw + cashSales + tx.drawer;
  const expectedSafe = opSafe + tx.safe;
  const expectedTotal = opDraw + opSafe + cashSales + tx.overallIn - tx.overallOut;
  const actualTotal = money(rec.actualDrawer) + money(rec.actualSafe);
  const variance = actualTotal - expectedTotal;
  const posTotal = cashSales + card + ebt + online + gift;
  return {
    opDraw, opSafe, cashSales, card, ebt, online, gift,
    expectedDrawer, expectedSafe, expectedTotal,
    actualTotal, variance, posTotal,
    nonCash: posTotal - cashSales,
    ...tx,
  };
}

function varianceStatus(v: number) {
  const abs = Math.abs(v);
  if (abs < 0.01) return { text: "Balanced", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (abs <= 5) return { text: "Review", color: "text-amber-700 bg-amber-50 border-amber-200" };
  return { text: v > 0 ? "Over" : "Short", color: "text-red-700 bg-red-50 border-red-200" };
}

/* ------------------------------------------------------------------ */
/*  Small UI bits                                                      */
/* ------------------------------------------------------------------ */
function StatCard({
  label, value, icon, note, variant,
}: {
  label: string; value: string; icon: string; note: string; variant?: string;
}) {
  const colorMap: Record<string, string> = {
    ok: "text-emerald-700",
    warn: "text-amber-600",
    bad: "text-red-600",
  };
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm" role="group" aria-label={label}>
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
        <span>{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 text-base" aria-hidden="true">{icon}</span>
      </div>
      <p className={`mt-3 text-2xl font-extrabold leading-tight ${variant ? colorMap[variant] || "" : ""}`}>{value}</p>
      <p className="mt-2 border-t border-dashed border-stone-200 pt-2 text-xs text-stone-500">{note}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <span className="text-[0.65rem] font-bold uppercase tracking-wide text-stone-500">{label}</span>
      <strong className="mt-1 block text-xl font-extrabold">{value}</strong>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-[0.65rem] font-bold uppercase tracking-wide text-stone-500">
      {children}
    </label>
  );
}

function Panel({
  icon, title, subtitle, actions, children,
}: {
  icon: string; title: string; subtitle: string; actions?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" aria-label={title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-xl" aria-hidden="true">{icon}</div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-stone-500">{subtitle}</p>
          </div>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [store, setStore] = useState<Store>(loadStore);
  const [currentDate, setCurrentDate] = useState(todayISO);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const record: DayRecord = store.records[currentDate] || defaultRecord(currentDate);
  const calc = calcRecord(record);

  /* persist whenever store changes */
  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(store));
  }, [store]);

  /* update record helper */
  const updateRecord = useCallback(
    (patch: Partial<DayRecord>) => {
      setStore((prev) => ({
        ...prev,
        records: {
          ...prev.records,
          [currentDate]: { ...(prev.records[currentDate] || defaultRecord(currentDate)), ...patch },
        },
      }));
    },
    [currentDate]
  );

  const updateField = useCallback(
    (field: keyof DayRecord, value: string | number) => updateRecord({ [field]: value }),
    [updateRecord]
  );

  const updateStoreMeta = useCallback(
    (field: "storeName" | "storeAddress", value: string) =>
      setStore((prev) => ({ ...prev, [field]: value })),
    []
  );

  /* transaction helpers */
  const addTx = useCallback(() => {
    const txs = [...record.transactions, { time: nowTime(), type: "Paid Out", location: "Drawer", amount: "" as const, note: "" }];
    updateRecord({ transactions: txs });
  }, [record.transactions, updateRecord]);

  const removeTx = useCallback(
    (idx: number) => {
      const txs = record.transactions.filter((_, i) => i !== idx);
      updateRecord({ transactions: txs });
    },
    [record.transactions, updateRecord]
  );

  const updateTx = useCallback(
    (idx: number, key: keyof Transaction, val: string | number) => {
      const txs = record.transactions.map((t, i) =>
        i === idx ? { ...t, [key]: key === "amount" ? (val === "" ? "" : money(val)) : val } : t
      );
      updateRecord({ transactions: txs });
    },
    [record.transactions, updateRecord]
  );

  /* shortcuts */
  const copyExpected = useCallback(() => {
    updateRecord({
      actualDrawer: Number(calc.expectedDrawer.toFixed(2)),
      actualSafe: Number(calc.expectedSafe.toFixed(2)),
    });
  }, [calc.expectedDrawer, calc.expectedSafe, updateRecord]);

  const carryForward = useCallback(() => {
    const prev = Object.keys(store.records)
      .filter((d) => d < currentDate)
      .sort()
      .pop();
    if (!prev) { alert("No previous day found"); return; }
    const p = store.records[prev];
    updateRecord({ openingDrawer: money(p.actualDrawer), openingSafe: money(p.actualSafe) });
  }, [store.records, currentDate, updateRecord]);

  /* exports */
  const downloadBlob = (blob: Blob, name: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const exportCsv = useCallback(() => {
    const c = calc;
    const lines = [
      ["Store", store.storeName],
      ["Address", store.storeAddress],
      ["Date", currentDate],
      ["Shift", record.shift],
      ["Cashier", record.cashier],
      ["Manager", record.manager],
      [],
      ["Opening Drawer", String(c.opDraw)],
      ["Opening Safe", String(c.opSafe)],
      ["POS Cash", String(c.cashSales)],
      ["Expected Total", String(c.expectedTotal)],
      ["Actual Total", String(c.actualTotal)],
      ["Variance", String(c.variance)],
      [],
      ["Transactions"],
      ["Time", "Type", "Location", "Amount", "Note"],
      ...record.transactions.map((tx) => [tx.time, tx.type, tx.location, String(money(tx.amount)), tx.note]),
      [],
      ["Notes", record.dailyNotes],
    ];
    const csv = lines
      .map((row) => (row as string[]).map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(","))
      .join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), `tedeset-${currentDate}.csv`);
  }, [calc, store, currentDate, record]);

  const exportJson = useCallback(() => {
    downloadBlob(new Blob([JSON.stringify(store, null, 2)], { type: "application/json" }), "tedeset-backup.json");
  }, [store]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const incoming = JSON.parse(e.target?.result as string);
        if (!incoming || typeof incoming !== "object") throw new Error();
        const newStore: Store = {
          storeName: incoming.storeName || "Tedeset",
          storeAddress: incoming.storeAddress || "",
          records: incoming.records || {},
        };
        setStore(newStore);
        const latest = Object.keys(newStore.records).sort().pop() || todayISO();
        setCurrentDate(latest);
        alert("Imported successfully");
      } catch {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  }, []);

  const clearDay = useCallback(() => {
    if (!confirm("Clear today's data? This cannot be undone.")) return;
    setStore((prev) => {
      const records = { ...prev.records };
      delete records[currentDate];
      return { ...prev, records };
    });
  }, [currentDate]);

  /* history rows */
  const historyRows = Object.keys(store.records)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7)
    .map((date) => {
      const c = calcRecord(store.records[date]);
      return { date, expected: c.expectedTotal, actual: c.actualTotal, variance: c.variance };
    });

  /* dashboard cards data */
  const dashCards = [
    { label: "Opening cash", value: usd(calc.opDraw + calc.opSafe), icon: "\u{1fa99}", note: "drawer + safe" },
    { label: "POS total", value: usd(calc.posTotal), icon: "\u{1f9fe}", note: "all sales" },
    { label: "Cash in", value: usd(calc.cashSales + calc.overallIn), icon: "\u2b06\ufe0f", note: "sales + bank in" },
    { label: "Cash out", value: usd(calc.overallOut), icon: "\u2b07\ufe0f", note: "expenses, drops, bank" },
    { label: "Expected close", value: usd(calc.expectedTotal), icon: "\u{1f4cc}", note: "what you should have" },
    {
      label: "Variance",
      value: usd(calc.variance),
      icon: "\u2696\ufe0f",
      note: Math.abs(calc.variance) < 0.01 ? "Balanced" : calc.variance > 0 ? "Over" : "Short",
      variant: Math.abs(calc.variance) < 0.01 ? "ok" : Math.abs(calc.variance) <= 5 ? "warn" : "bad",
    },
  ];

  const vs = varianceStatus(calc.variance);

  return (
    <div className="min-h-screen bg-[#f4f0ea] text-[#1e2b2c]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <div className="mx-auto max-w-[1480px] p-4">
        {/* Hero header */}
        <header className="mb-5 rounded-[2rem] bg-gradient-to-br from-[#284b3a] to-[#3d6b52] p-6 text-white shadow-lg print:border print:border-stone-400 print:bg-white print:text-black print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/15 text-3xl backdrop-blur-sm" aria-hidden="true">
                &#x1f9fa;
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{store.storeName || "Tedeset Market & Cafe"}</h1>
                <p className="text-sm opacity-85">Cash control dashboard</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 print:hidden" aria-label="Dashboard actions">
              <button onClick={() => { alert("Saved!"); }} className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50">
                Save
              </button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                Print
              </button>
              <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                Export CSV
              </button>
              <button onClick={exportJson} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                Backup JSON
              </button>
              <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                Back to site
              </Link>
            </nav>
          </div>

          {/* Toolbar */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 print:hidden">
            <div>
              <FieldLabel htmlFor="dash-date">Work date</FieldLabel>
              <input id="dash-date" type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value || todayISO())} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            <div>
              <FieldLabel htmlFor="dash-shift">Shift</FieldLabel>
              <select id="dash-shift" value={record.shift} onChange={(e) => updateField("shift", e.target.value)} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-white/50">
                <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="dash-cashier">Cashier</FieldLabel>
              <input id="dash-cashier" placeholder="name" value={record.cashier} onChange={(e) => updateField("cashier", e.target.value)} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            <div>
              <FieldLabel htmlFor="dash-manager">Manager</FieldLabel>
              <input id="dash-manager" placeholder="name" value={record.manager} onChange={(e) => updateField("manager", e.target.value)} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            <div>
              <FieldLabel htmlFor="dash-store">Store name</FieldLabel>
              <input id="dash-store" placeholder="Tedeset Market" value={store.storeName} onChange={(e) => updateStoreMeta("storeName", e.target.value)} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            <div>
              <FieldLabel htmlFor="dash-addr">Store address</FieldLabel>
              <input id="dash-addr" placeholder="street, city" value={store.storeAddress} onChange={(e) => updateStoreMeta("storeAddress", e.target.value)} className="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
          </div>
        </header>

        {/* Dashboard cards */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6" role="region" aria-label="Key figures">
          {dashCards.map((c) => (
            <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} note={c.note} variant={c.variant} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid items-start gap-5 xl:grid-cols-[2fr_1fr]">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* POS totals */}
            <Panel icon="&#x1f9fe;" title="1. POS totals" subtitle="Cash sales go to drawer, others just info">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {([
                  ["posCashSales", "Cash sales"],
                  ["posCardSales", "Card sales"],
                  ["posEbtSales", "EBT sales"],
                  ["posOnlineSales", "Online sales"],
                  ["posGiftCardSales", "Gift cards"],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <FieldLabel htmlFor={`pos-${field}`}>{label}</FieldLabel>
                    <input id={`pos-${field}`} type="number" step="0.01" placeholder="0.00" value={record[field] || ""} onChange={(e) => updateField(field, money(e.target.value))} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                  </div>
                ))}
                <div>
                  <FieldLabel htmlFor="pos-note">POS note</FieldLabel>
                  <input id="pos-note" placeholder="batch / till #" value={record.posNote} onChange={(e) => updateField("posNote", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MiniStat label="Total sales" value={usd(calc.posTotal)} />
                <MiniStat label="Cash to drawer" value={usd(calc.cashSales)} />
                <MiniStat label="Non-cash" value={usd(calc.nonCash)} />
              </div>
            </Panel>

            {/* Cash on hand */}
            <Panel
              icon="&#x1f4b0;"
              title="2. Cash on hand"
              subtitle="Opening, expected, and physical count"
              actions={
                <div className="flex gap-2 print:hidden">
                  <button onClick={copyExpected} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-200" aria-label="Copy expected values to actual fields">
                    Use expected
                  </button>
                  <button onClick={carryForward} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-200" aria-label="Carry forward previous day closing values">
                    Carry forward
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {([
                  ["openingDrawer", "Opening drawer"],
                  ["openingSafe", "Opening safe"],
                  ["actualDrawer", "Actual closing drawer"],
                  ["actualSafe", "Actual closing safe"],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <FieldLabel htmlFor={`cash-${field}`}>{label}</FieldLabel>
                    <input id={`cash-${field}`} type="number" step="0.01" placeholder="0.00" value={record[field] || ""} onChange={(e) => updateField(field, money(e.target.value))} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MiniStat label="Expected drawer" value={usd(calc.expectedDrawer)} />
                <MiniStat label="Expected safe" value={usd(calc.expectedSafe)} />
                <MiniStat label="Expected total" value={usd(calc.expectedTotal)} />
              </div>
            </Panel>

            {/* Cash log */}
            <Panel
              icon="&#x1f504;"
              title="3. Cash log"
              subtitle="Expenses, drops, bank, refunds"
              actions={
                <button onClick={addTx} className="rounded-full bg-[#c06d2b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a85e25] focus:outline-none focus:ring-2 focus:ring-amber-300 print:hidden" aria-label="Add new transaction row">
                  + Add row
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" role="table" aria-label="Cash transactions">
                  <thead>
                    <tr className="border-b-2 border-stone-200 text-left text-[0.65rem] font-bold uppercase tracking-wide text-stone-500">
                      <th className="px-1.5 py-2.5" scope="col">Time</th>
                      <th className="px-1.5 py-2.5" scope="col">Type</th>
                      <th className="px-1.5 py-2.5" scope="col">Location</th>
                      <th className="px-1.5 py-2.5" scope="col">Amount</th>
                      <th className="px-1.5 py-2.5" scope="col">Note</th>
                      <th className="px-1.5 py-2.5 print:hidden" scope="col"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          Click &quot;Add row&quot; to record cash movements
                        </td>
                      </tr>
                    ) : (
                      record.transactions.map((tx, idx) => (
                        <tr key={idx} className="border-b border-stone-100">
                          <td className="px-1 py-2">
                            <label className="sr-only" htmlFor={`tx-time-${idx}`}>Time for transaction {idx + 1}</label>
                            <input id={`tx-time-${idx}`} type="time" value={tx.time} onChange={(e) => updateTx(idx, "time", e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                          </td>
                          <td className="px-1 py-2">
                            <label className="sr-only" htmlFor={`tx-type-${idx}`}>Type for transaction {idx + 1}</label>
                            <select id={`tx-type-${idx}`} value={tx.type} onChange={(e) => updateTx(idx, "type", e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200">
                              {TX_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                          </td>
                          <td className="px-1 py-2">
                            <label className="sr-only" htmlFor={`tx-loc-${idx}`}>Location for transaction {idx + 1}</label>
                            <select id={`tx-loc-${idx}`} value={tx.location} onChange={(e) => updateTx(idx, "location", e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200">
                              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                            </select>
                          </td>
                          <td className="px-1 py-2">
                            <label className="sr-only" htmlFor={`tx-amt-${idx}`}>Amount for transaction {idx + 1}</label>
                            <input id={`tx-amt-${idx}`} type="number" step="0.01" min="0" value={tx.amount} onChange={(e) => updateTx(idx, "amount", e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                          </td>
                          <td className="px-1 py-2">
                            <label className="sr-only" htmlFor={`tx-note-${idx}`}>Note for transaction {idx + 1}</label>
                            <input id={`tx-note-${idx}`} type="text" placeholder="vendor/ref" value={tx.note} onChange={(e) => updateTx(idx, "note", e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm placeholder:text-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                          </td>
                          <td className="px-1 py-2 print:hidden">
                            <button onClick={() => removeTx(idx)} className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200" aria-label={`Remove transaction ${idx + 1}`}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MiniStat label="Cash in (total)" value={usd(calc.cashSales + calc.overallIn)} />
                <MiniStat label="Cash out (total)" value={usd(calc.overallOut)} />
                <MiniStat label="Bank deposits out" value={usd(calc.bankDeposit)} />
              </div>
              <div className="mt-4 rounded-2xl border-l-4 border-[#c06d2b] bg-[#f7ede1] px-4 py-3 text-sm text-stone-700">
                <strong>Paid out</strong> = cash expense (supplies, vendor). <strong>Cash refund</strong> = return. Safe drop moves drawer to safe.
              </div>
            </Panel>

            {/* Notes & approval */}
            <Panel icon="&#x1f4cb;" title="4. Notes & approval" subtitle="Reason for any variance, manager sign-off">
              <div>
                <FieldLabel htmlFor="daily-notes">Daily notes</FieldLabel>
                <textarea id="daily-notes" placeholder="Explain any shortage/over, vendor payments, envelope numbers..." value={record.dailyNotes} onChange={(e) => updateField("dailyNotes", e.target.value)} className="min-h-[80px] w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="sign-cashier">Cashier sign</FieldLabel>
                  <input id="sign-cashier" placeholder="name / initials" value={record.signCashier} onChange={(e) => updateField("signCashier", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
                <div>
                  <FieldLabel htmlFor="sign-manager">Manager sign</FieldLabel>
                  <input id="sign-manager" placeholder="name / initials" value={record.signManager} onChange={(e) => updateField("signManager", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
              </div>
            </Panel>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Daily summary */}
            <Panel icon="&#x2696;&#xfe0f;" title="Daily summary" subtitle="Actual vs expected & cash expenses">
              <div className="grid grid-cols-2 gap-3">
                <MiniStat label="Actual total cash" value={usd(calc.actualTotal)} />
                <div className={`rounded-2xl border p-4 ${vs.color}`}>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wide">Variance</span>
                  <strong className="mt-1 block text-xl font-extrabold">{usd(calc.variance)}</strong>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MiniStat label="Safe drop total" value={usd(calc.safeDrop)} />
                <MiniStat label="Bank cash in" value={usd(calc.bankCashIn)} />
                <MiniStat label="Cash expenses" value={usd(calc.payoutRefund)} />
              </div>
              {/* Variance helper */}
              <div
                className={`mt-4 rounded-2xl border-l-4 px-4 py-3 text-sm ${
                  Math.abs(calc.variance) < 0.01
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : Math.abs(calc.variance) <= 5
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-red-500 bg-red-50 text-red-800"
                }`}
                role="status"
                aria-live="polite"
              >
                {Math.abs(calc.variance) < 0.01
                  ? "Balanced \u2013 actual cash matches expected."
                  : Math.abs(calc.variance) <= 5
                  ? "Small variance \u2013 double-check cash expenses, refunds, and drops."
                  : "Large variance \u2013 recount drawer & safe, review all movements."}
              </div>
            </Panel>

            {/* Recent closes */}
            <Panel icon="&#x1f4c6;" title="Recent closes" subtitle="Last 7 days on device">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" role="table" aria-label="Recent daily closes">
                  <thead>
                    <tr className="border-b-2 border-stone-200 text-left text-[0.65rem] font-bold uppercase tracking-wide text-stone-500">
                      <th className="px-1.5 py-2" scope="col">Date</th>
                      <th className="px-1.5 py-2" scope="col">Expected</th>
                      <th className="px-1.5 py-2" scope="col">Actual</th>
                      <th className="px-1.5 py-2" scope="col">Var</th>
                      <th className="px-1.5 py-2" scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.length === 0 ? (
                      <tr><td colSpan={5} className="py-6 text-center text-stone-400">No previous days</td></tr>
                    ) : (
                      historyRows.map((r) => {
                        const s = varianceStatus(r.variance);
                        return (
                          <tr key={r.date} className="border-b border-stone-100">
                            <td className="px-1.5 py-2.5">
                              <button onClick={() => setCurrentDate(r.date)} className="font-medium text-[#3f6b51] underline decoration-stone-300 underline-offset-2 transition hover:text-[#2f4b3c] focus:outline-none focus:ring-2 focus:ring-amber-200" aria-label={`View ${r.date}`}>
                                {r.date}
                              </button>
                            </td>
                            <td className="px-1.5 py-2.5">{usd(r.expected)}</td>
                            <td className="px-1.5 py-2.5">{usd(r.actual)}</td>
                            <td className={`px-1.5 py-2.5 font-semibold ${Math.abs(r.variance) < 0.01 ? "text-emerald-700" : r.variance > 0 ? "text-amber-600" : "text-red-600"}`}>
                              {usd(r.variance)}
                            </td>
                            <td className="px-1.5 py-2.5">
                              <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${s.color}`}>{s.text}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Backup & tools */}
            <Panel icon="&#x1f9f0;" title="Backup & tools" subtitle="Export/import, reset day">
              <div className="grid grid-cols-2 gap-3 print:hidden">
                <button onClick={() => fileInputRef.current?.click()} className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-200">
                  Import backup
                </button>
                <button onClick={clearDay} className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200">
                  Clear today
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => { if (e.target.files?.[0]) importJson(e.target.files[0]); e.target.value = ""; }} aria-label="Import backup file" />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
