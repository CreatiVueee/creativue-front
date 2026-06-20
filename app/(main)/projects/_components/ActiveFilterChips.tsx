"use client";

import { X } from "lucide-react";
import type { FilterState } from "../_hooks/useContestFilters";

interface ActiveFilterChipsProps {
  filters: FilterState;
  totalActive: number;
  onRemove: (key: "aiFilter" | "contentFilter" | "prizeFilter", value: string) => void;
  onReset: () => void;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-purple-900">
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  );
}

export function ActiveFilterChips({
  filters, totalActive, onRemove, onReset,
}: ActiveFilterChipsProps) {
  if (totalActive === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {filters.aiFilter.map((v) => (
        <Chip key={v} label={`AI ${v}`} onRemove={() => onRemove("aiFilter", v)} />
      ))}
      {filters.contentFilter.map((v) => (
        <Chip key={v} label={v} onRemove={() => onRemove("contentFilter", v)} />
      ))}
      {filters.prizeFilter.map((v) => (
        <Chip key={v} label={v} onRemove={() => onRemove("prizeFilter", v)} />
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
      >
        전체 초기화
      </button>
    </div>
  );
}
