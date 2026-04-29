import type { DaySession, DailyReport, CashNotice, Expense } from "@prisma/client";
import { formatCurrency, formatDate } from "./utils";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function requiredEnv(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

type ReportEmailData = {
  session: DaySession;
  report: DailyReport;
  notices: CashNotice[];
  expenses: Expense[];
  cashier: { name: string };
};

function buildHtml(data: ReportEmailData): string {
  const { session, report, notices, expenses } = data;
  const pendingExpenses = expenses.filter((e) => e.status === "PENDING");
  const approvedExpenses = expenses.filter((e) => e.status === "APPROVED");
  const variance = report.variance;
  const varianceColor = variance === 0 ? "#2d6a4f" : Math.abs(variance) <= 5 ? "#b45309" : "#b91c1c";
  const varianceLabel = variance === 0 ? "Balanced" : variance > 0 ? `Over by ${formatCurrency(variance)}` : `Short by ${formatCurrency(Math.abs(variance))}`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f8f5f1; color: #1f1615; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; }
  .header { background: #3d2a18; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; opacity: 0.8; font-size: 14px; }
  .section { padding: 24px 32px; border-bottom: 1px solid #e8dcc8; }
  .section h2 { margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #7c5d42; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 15px; }
  .row.total { font-weight: 700; border-top: 1px solid #e8dcc8; margin-top: 8px; padding-top: 10px; }
  .variance { font-size: 18px; font-weight: 700; color: ${varianceColor}; }
  .alert { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; font-size: 14px; margin-top: 16px; }
  .footer { padding: 20px 32px; font-size: 12px; color: #888; text-align: center; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  table th { text-align: left; padding: 6px 8px; color: #7c5d42; border-bottom: 1px solid #e8dcc8; }
  table td { padding: 6px 8px; border-bottom: 1px solid #f3ede5; }
</style></head>
<body><div class="container">
  <div class="header">
    <h1>Daily Report — ${formatDate(session.date)}</h1>
    <p>Prepared by ${data.cashier.name} &bull; ${new Date().toLocaleTimeString("en-US")}</p>
  </div>

  <div class="section">
    <h2>Cash Summary</h2>
    <div class="row"><span>Opening Balance</span><span>${formatCurrency(report.openingBalance)}</span></div>
    <div class="row"><span>Total Sales (Cash)</span><span>${formatCurrency(session.cashSales ?? 0)}</span></div>
    <div class="row"><span>Total Sales (All)</span><span>${formatCurrency(report.totalSales)}</span></div>
    <div class="row"><span>Non-Register Cash In</span><span>+${formatCurrency(report.totalNoticeIn)}</span></div>
    <div class="row"><span>Non-Register Cash Out</span><span>-${formatCurrency(report.totalNoticeOut)}</span></div>
    <div class="row"><span>Approved Cash Expenses</span><span>-${formatCurrency(report.totalExpenses)}</span></div>
    <div class="row total"><span>Expected Cash</span><span>${formatCurrency(report.expectedCash)}</span></div>
    <div class="row total"><span>Actual Cash Count</span><span>${formatCurrency(report.actualCash)}</span></div>
    <div class="row" style="color:${varianceColor}"><strong>Variance</strong><strong>${varianceLabel}</strong></div>
    ${variance !== 0 && session.varianceNote ? `<div class="alert">Explanation: ${session.varianceNote}</div>` : ""}
  </div>

  ${approvedExpenses.length > 0 ? `
  <div class="section">
    <h2>Expenses (${approvedExpenses.length} approved)</h2>
    <table>
      <tr><th>Description</th><th>Category</th><th>Method</th><th>Amount</th></tr>
      ${approvedExpenses.map(e => `<tr><td>${e.description}</td><td>${e.category}</td><td>${e.paymentMethod}</td><td>${formatCurrency(e.amount)}</td></tr>`).join("")}
    </table>
  </div>` : ""}

  ${notices.length > 0 ? `
  <div class="section">
    <h2>Non-Register Cash Notices (${notices.length})</h2>
    <table>
      <tr><th>Type</th><th>Description</th><th>Amount</th><th>Verified</th></tr>
      ${notices.map(n => `<tr><td>${n.direction}</td><td>${n.description}</td><td>${formatCurrency(n.amount)}</td><td>${n.verified ? "Yes" : "No"}</td></tr>`).join("")}
    </table>
  </div>` : ""}

  ${pendingExpenses.length > 0 ? `
  <div class="section">
    <div class="alert">⚠ ${pendingExpenses.length} expense(s) still pending approval.</div>
  </div>` : ""}

  <div class="footer">Tedeset Cafe &bull; POS Cash Management System</div>
</div></body></html>`;
}

export async function sendDailyReportEmail(data: ReportEmailData): Promise<{ ok: boolean; error?: string }> {
  const apiKey = requiredEnv(process.env.BREVO_API_KEY);
  const senderEmail = requiredEnv(process.env.BREVO_SENDER_EMAIL);
  const senderName = process.env.BREVO_SENDER_NAME ?? "Tedeset Cafe POS";
  const ownerEmail = requiredEnv(process.env.OWNER_EMAIL);

  if (!apiKey || !senderEmail || !ownerEmail) {
    return { ok: false, error: "Email configuration missing" };
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: ownerEmail, name: "Owner" }],
    subject: `Daily Report — ${formatDate(data.session.date)}`,
    htmlContent: buildHtml(data)
  };

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo report error", res.status, body);
      return { ok: false, error: `Brevo error ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Brevo report send failed", err);
    return { ok: false, error: "Network error" };
  }
}
