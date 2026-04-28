"use client";

import { Printer } from "lucide-react";

interface PrintReportProps {
  date: string;
}

export function PrintReport({ date }: PrintReportProps) {
  function handlePrint() {
    requestAnimationFrame(() => {
      window.print();
    });
  }

  return (
    <button
      onClick={handlePrint}
      data-print-trigger
      data-no-print
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
    >
      <Printer className="h-4 w-4" />
      Print
    </button>
  );
}
