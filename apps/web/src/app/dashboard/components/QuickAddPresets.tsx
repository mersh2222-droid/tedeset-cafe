"use client";

import { useState, useEffect } from "react";
import { Zap, Settings } from "lucide-react";
import { getQuickPresets, addTransaction } from "@/lib/dashboard.store";
import type { QuickAddPreset } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { PresetManager } from "./PresetManager";

interface QuickAddPresetsProps {
  shiftId?: string;
  onAdded: () => void;
}

export function QuickAddPresets({ shiftId, onAdded }: QuickAddPresetsProps) {
  const [presets, setPresets] = useState<QuickAddPreset[]>([]);
  const [managerOpen, setManagerOpen] = useState(false);

  useEffect(() => {
    setPresets(getQuickPresets());
  }, []);

  function refreshPresets() {
    setPresets(getQuickPresets());
  }

  function handleQuickAdd(preset: QuickAddPreset) {
    addTransaction({
      amount: preset.amount,
      paymentMethod: preset.paymentMethod,
      description: preset.description || preset.label,
      category: preset.category,
      shiftId,
    });
    onAdded();
  }

  return (
    <div className="flex flex-wrap items-center gap-2" data-no-print>
      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Zap className="h-3.5 w-3.5" />
        Quick Add
      </span>
      {presets.map((p) => (
        <button
          key={p.id}
          onClick={() => handleQuickAdd(p)}
          className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium shadow-sm transition hover:bg-accent"
        >
          {p.label} · {formatPrice(p.amount)}
        </button>
      ))}
      <button
        onClick={() => setManagerOpen(true)}
        className="rounded-full border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
        title="Manage presets"
      >
        <Settings className="h-3.5 w-3.5" />
      </button>
      <PresetManager
        open={managerOpen}
        onOpenChange={setManagerOpen}
        onPresetsChanged={refreshPresets}
      />
    </div>
  );
}
