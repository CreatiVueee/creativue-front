"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X, SearchX } from "lucide-react";
import { ContestCard } from "@/features/contests/ui/ContestCard";
import { useContestFilters, SORT_OPTIONS, type SortOption } from "./_hooks/useContestFilters";
import { FilterPanel } from "./_components/FilterPanel";
import { HotTicker } from "./_components/HotTicker";
import { ActiveFilterChips } from "./_components/ActiveFilterChips";

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <SearchX size={40} className="text-gray-300 mb-4" />
      <p className="text-gray-500 font-semibold mb-1">조건에 맞는 공모전이 없어요</p>
      <p className="text-sm text-gray-400 mb-6">필터를 조정하거나 검색어를 바꿔보세요.</p>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-opacity hover:opacity-80"
        style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)" }}
      >
        필터 초기화
      </button>
    </div>
  );
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────

function MobileFilterDrawer({
  open, onClose, children,
}: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <span className="font-bold text-gray-900">필터</span>
              <button type="button" onClick={onClose}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { filters, filtered, hotContests, totalActive, update, toggle, reset } =
    useContestFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filterPanelProps = {
    filters,
    totalActive,
    onToggle: toggle,
    onReset: reset,
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      {/* Hero Banner */}
      <div
        className="px-6 pt-10 pb-10"
        style={{ background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-white/70 text-sm mb-1.5">Open Call · 공모전 탐색</p>
          <h1 className="text-white font-black mb-3" style={{ fontSize: "2rem" }}>
            당신의 크리에이티브로<br />
            브랜드를 빛내세요
          </h1>
          <p className="text-white/80 text-sm mb-6 max-w-lg">
            다양한 브랜드의 공모전에 참여하고, 실력을 증명하고, 보상을 받아보세요.
          </p>

          {/* Search Input */}
          <div className="relative max-w-lg">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="브랜드명, 업종, 콘텐츠 유형 검색"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white text-gray-800 placeholder:text-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* HOT Ticker */}
        <HotTicker contests={hotContests} />

        <div className="flex gap-7 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterPanel {...filterPanelProps} />
          </div>

          {/* Mobile Drawer */}
          <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <FilterPanel {...filterPanelProps} />
          </MobileFilterDrawer>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-purple-300 transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  필터
                  {totalActive > 0 && (
                    <span
                      className="text-[10px] text-white rounded-full px-1.5 py-0.5 font-bold leading-none"
                      style={{ background: "#b26efd" }}
                    >
                      {totalActive}
                    </span>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{filtered.length}</span>개
                </span>
              </div>

              {/* Sort Select */}
              <select
                value={filters.sortBy}
                onChange={(e) => update({ sortBy: e.target.value as SortOption })}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips
              filters={filters}
              totalActive={totalActive}
              onRemove={toggle}
              onReset={reset}
            />

            {/* Contest Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.length === 0 ? (
                <EmptyState onReset={reset} />
              ) : (
                filtered.map((contest, i) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <ContestCard contest={contest} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
