-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CASHIER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DaySession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "openingBalance" REAL NOT NULL,
    "cashierId" INTEGER NOT NULL,
    "closedAt" DATETIME,
    "totalSales" REAL,
    "cashSales" REAL,
    "salesNotes" TEXT,
    "varianceNote" TEXT,
    "varianceSignedBy" TEXT,
    "varianceSignedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DaySession_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CashNotice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "daySessionId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "signedById" INTEGER NOT NULL,
    "witnessName" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "verifiedByName" TEXT,
    "printedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CashNotice_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CashNotice_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "daySessionId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "receiptNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedById" INTEGER NOT NULL,
    "approvedById" INTEGER,
    "approvedAt" DATETIME,
    "rejectionNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CashCount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "daySessionId" INTEGER NOT NULL,
    "bills100" INTEGER NOT NULL DEFAULT 0,
    "bills50" INTEGER NOT NULL DEFAULT 0,
    "bills20" INTEGER NOT NULL DEFAULT 0,
    "bills10" INTEGER NOT NULL DEFAULT 0,
    "bills5" INTEGER NOT NULL DEFAULT 0,
    "bills2" INTEGER NOT NULL DEFAULT 0,
    "bills1" INTEGER NOT NULL DEFAULT 0,
    "coins50" INTEGER NOT NULL DEFAULT 0,
    "coins25" INTEGER NOT NULL DEFAULT 0,
    "coins10" INTEGER NOT NULL DEFAULT 0,
    "coins5" INTEGER NOT NULL DEFAULT 0,
    "coins1" INTEGER NOT NULL DEFAULT 0,
    "totalCounted" REAL NOT NULL,
    "expectedCash" REAL NOT NULL,
    "variance" REAL NOT NULL,
    "varianceExplanation" TEXT,
    "countedByName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CashCount_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "daySessionId" INTEGER NOT NULL,
    "openingBalance" REAL NOT NULL,
    "totalSales" REAL NOT NULL,
    "totalNoticeIn" REAL NOT NULL,
    "totalNoticeOut" REAL NOT NULL,
    "totalExpenses" REAL NOT NULL,
    "expectedCash" REAL NOT NULL,
    "actualCash" REAL NOT NULL,
    "variance" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "emailSentAt" DATETIME,
    "emailSentTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyReport_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DaySession_date_key" ON "DaySession"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CashCount_daySessionId_key" ON "CashCount"("daySessionId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_daySessionId_key" ON "DailyReport"("daySessionId");
