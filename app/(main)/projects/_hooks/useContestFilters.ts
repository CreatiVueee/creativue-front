"use client";

import { useState, useMemo } from "react";
import { contests } from "@/data/contests";
import { calcDday } from "@/shared/lib/utils/date";
import type { Contest } from "@/shared/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = "최신순" | "상금 높은순" | "마감 임박순" | "지원자 많은순";

export interface FilterState {
  search: string;
  aiFilter: string[];
  contentFilter: string[];
  prizeFilter: string[];
  sortBy: SortOption;
}

// ─── Constants (export — FilterPanel이 UI 렌더에 사용) ───────────────────────

export const AI_OPTIONS = ["가능", "불가능"] as const;

export const CONTENT_OPTIONS = [
  "로고", "포스터 템플릿", "디지털 광고 템플릿", "제품 디자인",
  "상세페이지", "DA", "해외 광고", "기타",
] as const;

export const PRIZE_OPTIONS = [
  { label: "30만원 이하",   min: 0,          max: 300_000 },
  { label: "30~50만원",    min: 300_000,    max: 500_000 },
  { label: "50~70만원",    min: 500_000,    max: 700_000 },
  { label: "70~100만원",   min: 700_000,    max: 1_000_000 },
  { label: "100~200만원",  min: 1_000_000,  max: 2_000_000 },
  { label: "200~300만원",  min: 2_000_000,  max: 3_000_000 },
  { label: "300~500만원",  min: 3_000_000,  max: 5_000_000 },
  { label: "500만원 이상",  min: 5_000_000,  max: Infinity },
] as const;

export const SORT_OPTIONS: SortOption[] = ["최신순", "상금 높은순", "마감 임박순", "지원자 많은순"];

// 필터 레이블 → 실제 contentTypes 값 매핑
const CONTENT_TYPE_MAP: Record<string, string[]> = {
  "로고":              ["로고"],
  "포스터 템플릿":      ["포스터 템플릿"],
  "디지털 광고 템플릿": ["디지털 광고 템플릿", "배너 광고"],
  "제품 디자인":       ["제품 디자인"],
  "상세페이지":        ["상세페이지"],
  "DA":               ["DA"],
  "해외 광고":         ["해외 광고"],
  "기타":             ["슬로건", "기타"],
};

const INITIAL_FILTERS: FilterState = {
  search: "",
  aiFilter: [],
  contentFilter: [],
  prizeFilter: [],
  sortBy: "최신순",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useContestFilters() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const update = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const toggle = (key: "aiFilter" | "contentFilter" | "prizeFilter", value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const reset = () => setFilters((prev) => ({
    ...INITIAL_FILTERS,
    search: prev.search,
    sortBy: prev.sortBy,
  }));

  const totalActive =
    filters.aiFilter.length + filters.contentFilter.length + filters.prizeFilter.length;

  const hotContests = useMemo(() => contests.filter((c) => c.hot), []);

  const filtered = useMemo((): Contest[] => {
    const q = filters.search.toLowerCase().trim();

    return contests
      .filter((c) => {
        if (q &&
          !c.brand.toLowerCase().includes(q) &&
          !c.industry.toLowerCase().includes(q) &&
          !c.contentTypes.some((ct) => ct.toLowerCase().includes(q))
        ) return false;

        if (filters.aiFilter.length > 0) {
          const wantsAllowed  = filters.aiFilter.includes("가능");
          const wantsDisabled = filters.aiFilter.includes("불가능");
          if (wantsAllowed  && !wantsDisabled && !c.aiAllowed) return false;
          if (wantsDisabled && !wantsAllowed  &&  c.aiAllowed) return false;
        }

        if (filters.contentFilter.length > 0) {
          const matched = filters.contentFilter.some((label) =>
            (CONTENT_TYPE_MAP[label] ?? [label]).some((target) =>
              c.contentTypes.includes(target)
            )
          );
          if (!matched) return false;
        }

        if (filters.prizeFilter.length > 0) {
          const matched = filters.prizeFilter.some((label) => {
            const range = PRIZE_OPTIONS.find((o) => o.label === label);
            return range ? c.prize >= range.min && c.prize < range.max : false;
          });
          if (!matched) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "상금 높은순":   return b.prize - a.prize;
          case "마감 임박순":   return calcDday(a.deadline) - calcDday(b.deadline);
          case "지원자 많은순": return b.applicants - a.applicants;
          default:             return b.id - a.id;
        }
      });
  }, [filters]);

  return { filters, filtered, hotContests, totalActive, update, toggle, reset };
}
