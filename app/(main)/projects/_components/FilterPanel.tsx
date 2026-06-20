"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, RotateCcw, Check } from "lucide-react";
import {
  AI_OPTIONS, CONTENT_OPTIONS, PRIZE_OPTIONS,
  type FilterState,
} from "../_hooks/useContestFilters";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: FilterState;
  totalActive: number;
  onToggle: (key: "aiFilter" | "contentFilter" | "prizeFilter", value: string) => void;
  onReset: () => void;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function CheckItem({
  label, checked, onToggle,
}: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 w-full text-left py-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span
        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          background: checked ? "#b26efd" : "white",
          borderColor: checked ? "#b26efd" : "#d1d5db",
        }}
      >
        {checked && <Check size={10} strokeWidth={3} color="white" />}
      </span>
      {label}
    </button>
  );
}

function FilterSection({
  title, children, activeCount,
}: { title: string; children: React.ReactNode; activeCount: number }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {title}
          {activeCount > 0 && (
            <span
              className="text-[10px] text-white rounded-full px-1.5 py-0.5 font-bold leading-none"
              style={{ background: "#b26efd" }}
            >
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={15}
          className="text-gray-400 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FilterPanel({ filters, totalActive, onToggle, onReset }: FilterPanelProps) {
  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-gray-900">필터</span>
          {totalActive > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw size={11} />
              초기화
            </button>
          )}
        </div>

        {/* AI 활용 여부 */}
        <FilterSection title="AI 활용 여부" activeCount={filters.aiFilter.length}>
          {AI_OPTIONS.map((opt) => (
            <CheckItem
              key={opt}
              label={`AI ${opt}`}
              checked={filters.aiFilter.includes(opt)}
              onToggle={() => onToggle("aiFilter", opt)}
            />
          ))}
        </FilterSection>

        {/* 콘텐츠 분류 */}
        <FilterSection title="콘텐츠 분류" activeCount={filters.contentFilter.length}>
          {CONTENT_OPTIONS.map((opt) => (
            <CheckItem
              key={opt}
              label={opt}
              checked={filters.contentFilter.includes(opt)}
              onToggle={() => onToggle("contentFilter", opt)}
            />
          ))}
        </FilterSection>

        {/* 상금 범위 */}
        <FilterSection title="상금 범위" activeCount={filters.prizeFilter.length}>
          {PRIZE_OPTIONS.map(({ label }) => (
            <CheckItem
              key={label}
              label={label}
              checked={filters.prizeFilter.includes(label)}
              onToggle={() => onToggle("prizeFilter", label)}
            />
          ))}
        </FilterSection>
      </div>
    </aside>
  );
}
