"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import type { Contest } from "@/shared/types";
import { calcDday, formatDday } from "@/shared/lib/utils/date";

interface HotTickerProps {
  contests: Contest[];
}

function HotTickerItem({ contest }: { contest: Contest }) {
  const dday = calcDday(contest.deadline);
  const ddayLabel = formatDday(dday);

  return (
    <Link
      href={`/projects/${contest.id}`}
      className="flex items-center gap-3 flex-shrink-0 bg-white border border-red-100 rounded-xl px-4 py-3 hover:border-red-300 hover:shadow-sm transition-all"
    >
      <div
        className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${contest.image})` }}
      />
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{contest.brand}</p>
        <p className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">{contest.industry}</p>
      </div>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: dday <= 3 ? "#fee2e2" : "#f3f4f6",
          color: dday <= 3 ? "#dc2626" : "#6b7280",
        }}
      >
        {ddayLabel}
      </span>
    </Link>
  );
}

export function HotTicker({ contests }: HotTickerProps) {
  if (contests.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={16} className="text-red-500" />
        <span className="text-sm font-bold text-gray-800">지금 HOT한 공모전</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {contests.map((c) => (
          <HotTickerItem key={c.id} contest={c} />
        ))}
      </div>
    </div>
  );
}
