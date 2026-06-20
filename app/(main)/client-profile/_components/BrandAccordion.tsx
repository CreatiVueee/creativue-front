"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  FileText, BookOpen, Fingerprint, Hash, Users,
  CheckCircle, ChevronDown, ChevronUp, PenLine,
  Globe, User, Tag,
  type LucideIcon,
} from "lucide-react";
import { useBrandReviewStore, type BrandReviewData } from "@/features/auth/store/brandReviewStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionConfig {
  id: number;
  label: string;
  sub: string;
  icon: LucideIcon;
  isComplete: (d: BrandReviewData) => boolean;
  renderContent: (d: BrandReviewData) => React.ReactNode;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

type ChipColor = "purple" | "blue" | "gray";

const CHIP_STYLES: Record<ChipColor, React.CSSProperties> = {
  purple: { background: "linear-gradient(135deg,#f3b0f220,#b26efd20)", color: "#7c3aed", border: "1px solid #d8b4fe" },
  blue:   { background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe" },
  gray:   { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" },
};

function InfoChip({ label, color = "purple" }: { label: string; color?: ChipColor }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={CHIP_STYLES[color]}>
      {label}
    </span>
  );
}

function ChipGroup({ label, items, color = "purple" }: { label: string; items: string[]; color?: ChipColor }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => <InfoChip key={item} label={item} color={color} />)}
      </div>
    </div>
  );
}

// ─── Section content renderers ────────────────────────────────────────────────

const SECTIONS: SectionConfig[] = [
  {
    id: 1,
    label: "브랜드 디테일",
    sub: "이름 · 업종 · 로고",
    icon: FileText,
    isComplete: (d) => d.brandName.trim().length > 0 && d.industries.length > 0,
    renderContent: (d) => (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-1">브랜드 이름</p>
          <p className="text-sm font-bold text-gray-800">{d.brandName}</p>
        </div>
        <ChipGroup label="업종" items={d.industries} color="purple" />
      </div>
    ),
  },
  {
    id: 2,
    label: "브랜드 스토리",
    sub: "창업 배경 · 비전",
    icon: BookOpen,
    isComplete: (d) => d.brandStory.trim().length > 0,
    renderContent: (d) => (
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">브랜드 스토리</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line line-clamp-6">{d.brandStory}</p>
      </div>
    ),
  },
  {
    id: 3,
    label: "브랜드 아이덴티티",
    sub: "개성 · 차별화",
    icon: Fingerprint,
    isComplete: (d) => d.brandIdentity.trim().length > 0,
    renderContent: (d) => (
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">브랜드 아이덴티티</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line line-clamp-6">{d.brandIdentity}</p>
      </div>
    ),
  },
  {
    id: 4,
    label: "브랜드 이미지",
    sub: "인식 · 핵심 키워드",
    icon: Hash,
    isComplete: (d) => d.desiredPerception.trim().length > 0 || d.keywords.length > 0,
    renderContent: (d) => (
      <div className="space-y-4">
        {d.desiredPerception && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">원하는 브랜드 인식</p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{d.desiredPerception}</p>
          </div>
        )}
        {d.keywords.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">핵심 키워드</p>
            <div className="flex flex-wrap gap-1.5">
              {d.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg,#f3b0f230,#b26efd20)", color: "#7c3aed", border: "1px solid #d8b4fe" }}
                >
                  <Tag size={10} />{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    id: 5,
    label: "타겟 소비자",
    sub: "인구통계 · 관심사",
    icon: Users,
    isComplete: (d) =>
      !!(d.market || d.gender || d.ageGroups.length > 0 || d.interests.length > 0 || d.occupation || d.additionalNotes),
    renderContent: (d) => (
      <div className="space-y-3">
        {d.market && (
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-400">타겟 시장</span>
            <InfoChip label={d.market} color="blue" />
          </div>
        )}
        {d.gender && (
          <div className="flex items-center gap-2">
            <User size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-400">성별</span>
            <InfoChip label={d.gender} color="gray" />
          </div>
        )}
        <ChipGroup label="연령대" items={d.ageGroups} color="gray" />
        <ChipGroup label="관심사" items={d.interests} color="purple" />
        {d.occupation && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">직업군</p>
            <p className="text-sm text-gray-700">{d.occupation}</p>
          </div>
        )}
        {d.additionalNotes && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">기타 사항</p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{d.additionalNotes}</p>
          </div>
        )}
      </div>
    ),
  },
];

// ─── EmptySection ─────────────────────────────────────────────────────────────

function EmptySection({ onGoReview }: { onGoReview: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
        <PenLine size={18} className="text-gray-300" />
      </div>
      <p className="text-sm text-gray-400">아직 작성된 내용이 없어요</p>
      <button
        onClick={onGoReview}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
      >
        <PenLine size={13} />
        작성하러 가기
      </button>
    </div>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  isOpen,
  onToggle,
  brandData,
  onGoReview,
}: {
  section: SectionConfig;
  isOpen: boolean;
  onToggle: () => void;
  brandData: BrandReviewData;
  onGoReview: () => void;
}) {
  const Icon = section.icon;
  const isComplete = section.isComplete(brandData);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isComplete
                ? "linear-gradient(135deg, #b26efd, #93b5f6)"
                : "#f3f4f6",
            }}
          >
            {isComplete
              ? <CheckCircle size={16} className="text-white" />
              : <Icon size={16} className="text-gray-400" />
            }
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">{section.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{section.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            style={
              isComplete
                ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                : { background: "#fff7ed", color: "#d97706", border: "1px solid #fed7aa" }
            }
          >
            {isComplete ? "완료" : "미완성"}
          </span>
          {isOpen
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 border-t border-gray-100 pt-4">
              {isComplete
                ? section.renderContent(brandData)
                : <EmptySection onGoReview={onGoReview} />
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BrandAccordion (export) ──────────────────────────────────────────────────

export function BrandAccordion() {
  const router = useRouter();
  const { data } = useBrandReviewStore();
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]));

  const completedCount = useMemo(
    () => SECTIONS.filter((s) => s.isComplete(data)).length,
    [data]
  );
  const isAllComplete = completedCount === SECTIONS.length;
  const progressPct = Math.round((completedCount / SECTIONS.length) * 100);

  const toggleSection = (id: number) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-5">
      {/* 완성도 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <p className="text-xs font-semibold text-gray-400 mb-4">브랜드 리뷰 완성도</p>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span
              className="font-black"
              style={{ fontSize: "1.6rem", color: isAllComplete ? "#7c3aed" : "#374151" }}
            >
              {completedCount}
            </span>
            <span className="text-gray-300 text-xl">/</span>
            <span className="font-bold text-gray-400 text-lg">5</span>
            {isAllComplete && (
              <span
                className="ml-1 text-xs px-2 py-0.5 rounded-full text-white font-bold"
                style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
              >
                완성!
              </span>
            )}
          </div>
          <div className="flex-1 max-w-[200px]">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #f3b0f2, #b26efd, #93b5f6)" }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{progressPct}% 완료</p>
          </div>
        </div>
        <div className="mt-4">
          {isAllComplete ? (
            <button
              onClick={() => router.push("/projects/create")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
            >
              공모전 개최하기 →
            </button>
          ) : (
            <button
              onClick={() => router.push("/brand-review")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "#b26efd", background: "rgba(178,110,253,0.08)", border: "1px solid rgba(178,110,253,0.2)" }}
            >
              <PenLine size={13} />
              지금 작성하기
            </button>
          )}
        </div>
      </div>

      {/* 아코디언 섹션들 */}
      {SECTIONS.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          isOpen={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
          brandData={data}
          onGoReview={() => router.push("/brand-review")}
        />
      ))}
    </div>
  );
}
