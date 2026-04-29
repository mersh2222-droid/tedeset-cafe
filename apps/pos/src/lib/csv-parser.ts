import Papa from "papaparse";

export interface ParsedSalesData {
  netSales: number;
  cashSales: number | null;
  rowCount: number;
  source: string;
}

const NET_SALES_KEYS = ["net_sales", "netsales", "net sales", "total", "total_sales", "totalsales", "gross", "revenue", "amount"];
const CASH_SALES_KEYS = ["cash", "cash_sales", "cashsales", "cash sales", "cash_amount"];

function findColumn(headers: string[], candidates: string[]): string | null {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex((h) => h.includes(c));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

export function parseSalesCSV(csvText: string): ParsedSalesData {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim()
  });

  const rows = result.data;
  if (!rows.length) throw new Error("CSV is empty");

  const headers = Object.keys(rows[0]);
  const netCol = findColumn(headers, NET_SALES_KEYS);
  const cashCol = findColumn(headers, CASH_SALES_KEYS);

  if (!netCol) throw new Error("Could not find a sales total column in CSV. Expected a column named: total, net_sales, revenue, or similar.");

  let netSales = 0;
  let cashSales = 0;
  let hasCash = false;

  for (const row of rows) {
    const raw = String(row[netCol] ?? "").replace(/[$,\s]/g, "");
    const val = parseFloat(raw);
    if (!isNaN(val)) netSales += val;

    if (cashCol) {
      const rawCash = String(row[cashCol] ?? "").replace(/[$,\s]/g, "");
      const cashVal = parseFloat(rawCash);
      if (!isNaN(cashVal)) {
        cashSales += cashVal;
        hasCash = true;
      }
    }
  }

  return {
    netSales: Math.round(netSales * 100) / 100,
    cashSales: hasCash ? Math.round(cashSales * 100) / 100 : null,
    rowCount: rows.length,
    source: "csv"
  };
}
