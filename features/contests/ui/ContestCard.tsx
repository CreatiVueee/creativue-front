"use client";

import Link from "next/link";
import { Trophy, Users, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { calcDday } from "@/shared/lib/utils/date";
import type { Contest } from "@/shared/types";

// ── D-day 배지 3색 스타일 ────────────────────────────────────────────────────
function getDdayStyle(dday: number) {
  if (dday <= 3) return { bg: "#fef2f2", color: "#ef4444", border: "#fca5a5" };
  if (dday <= 7) return { bg: "#fff7ed", color: "#ea580c", border: "#fdba74" };
  return { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" };
}

// ── AI 배지 아이콘 (figma_markup 기준 SVG) ───────────────────────────────────
const AiOnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1"/>
    <path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3"/>
  </svg>
);

const AiOffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1"/>
    <path d="M9 7V4M15 7V4M9 20v-3M15 20v-3M4 9h3M4 15h3M17 9h3M17 15h3M3 3l18 18"/>
  </svg>
);

// ── Props ────────────────────────────────────────────────────────────────────
interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const dday = calcDday(contest.deadline);
  const ddayStyle = getDdayStyle(dday);
  const deadlineLabel = format(parseISO(contest.deadline), "M/d");
  const categoryLabel = contest.contentTypes[0] ?? "기타";

  return (
    <Link
      href={`/projects/${contest.id}`}
      className="block bg-white overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 18,
        border: "1px solid #f0f0f6",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* 썸네일 */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={contest.image}
          alt={contest.brand}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />

        {/* 좌상단: 카테고리 + AI 배지 */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            {categoryLabel}
          </span>
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{
              color: contest.aiAllowed ? "#7c3aed" : "#6b7280",
              background: contest.aiAllowed
                ? "rgba(237,233,254,0.92)"
                : "rgba(243,244,246,0.92)",
              border: `1px solid ${contest.aiAllowed ? "#c4b5fd" : "#d1d5db"}`,
            }}
          >
            {contest.aiAllowed ? <AiOnIcon /> : <AiOffIcon />}
            {contest.aiAllowed ? "AI 가능" : "AI 불가"}
          </span>
        </div>

        {/* 우상단: D-day 배지 */}
        <span
          className="absolute top-3 right-3 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
          style={{
            background: ddayStyle.bg,
            color: ddayStyle.color,
            border: `1px solid ${ddayStyle.border}`,
          }}
        >
          {dday <= 0 ? "마감" : `D-${dday}`}
        </span>
      </div>

      {/* 콘텐츠 */}
      <div style={{ padding: "16px 18px" }}>
        {/* 제목 (2줄 클램프) */}
        <p
          className="text-sm font-extrabold leading-snug mb-1 overflow-hidden"
          style={{
            color: "#1a0533",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {contest.contentTypes.slice(0, 2).join(" · ")} 공모전
        </p>
        <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
          {contest.brand}
        </p>

        {/* 하단 정보 행 */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          {/* 상금 */}
          <div className="flex items-center gap-1.5">
            <Trophy size={16} strokeWidth={1.8} style={{ color: "#b26efd" }} />
            <div>
              <div className="text-[10px]" style={{ color: "#9ca3af" }}>상금</div>
              <div
                className="text-sm font-black"
                style={{
                  background: "linear-gradient(90deg, #b26efd, #93b5f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ₩{contest.prize.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 참여자 */}
          <div className="flex items-center gap-1.5">
            <Users size={16} strokeWidth={1.8} style={{ color: "#6b7280" }} />
            <div>
              <div className="text-[10px]" style={{ color: "#9ca3af" }}>참여자</div>
              <div className="text-sm font-bold" style={{ color: "#374151" }}>
                {contest.applicants}명
              </div>
            </div>
          </div>

          {/* 마감일 */}
          <div className="flex items-center gap-1.5">
            <Calendar size={16} strokeWidth={1.8} style={{ color: "#6b7280" }} />
            <div>
              <div className="text-[10px]" style={{ color: "#9ca3af" }}>마감일</div>
              <div className="text-sm font-bold" style={{ color: "#374151" }}>
                {deadlineLabel}
              </div>
            </div>
          </div>

          {/* 상세보기 */}
          <span
            className="flex items-center gap-1 text-xs font-bold text-white"
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #b26efd, #93b5f6)",
            }}
          >
            상세보기
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
