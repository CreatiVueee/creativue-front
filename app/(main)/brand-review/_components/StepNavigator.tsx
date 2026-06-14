"use client";

import { motion } from "motion/react";
import {
  CheckCircle,
  FileText,
  BookOpen,
  Fingerprint,
  Hash,
  Users,
  type LucideIcon,
} from "lucide-react";

// ─── Types & Constants ────────────────────────────────────────────────────────

export interface StepConfig {
  id: number;
  label: string;
  sub: string;
  icon: LucideIcon;
}

export const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "브랜드 디테일",
    sub: "이름 · 업종 · 로고",
    icon: FileText,
  },
  {
    id: 2,
    label: "브랜드 스토리",
    sub: "창업 배경 · 비전",
    icon: BookOpen,
  },
  {
    id: 3,
    label: "브랜드 아이덴티티",
    sub: "개성 · 차별화",
    icon: Fingerprint,
  },
  {
    id: 4,
    label: "브랜드 이미지",
    sub: "인식 · 핵심 키워드",
    icon: Hash,
  },
  {
    id: 5,
    label: "타겟 소비자",
    sub: "인구통계 · 관심사",
    icon: Users,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface StepNavigatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepNavigator({ currentStep, onStepClick }: StepNavigatorProps) {
  const progressPct = Math.round(((currentStep - 1) / STEPS.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        {/* 스텝 행 */}
        <div className="flex items-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isClickable = step.id <= currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className="flex flex-col items-center gap-2 flex-shrink-0 transition-all disabled:cursor-default"
                >
                  {/* 원형 아이콘 */}
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isCompleted
                        ? "linear-gradient(135deg, #b26efd, #93b5f6)"
                        : isActive
                        ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                        : "#f3f4f6",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(178,110,253,0.4)"
                        : "none",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={15} className="text-white" />
                    ) : (
                      <Icon
                        size={15}
                        style={{ color: isActive ? "white" : "#9ca3af" }}
                      />
                    )}
                  </div>

                  {/* 라벨 */}
                  <div className="text-center">
                    <p
                      className="text-[11px] leading-tight whitespace-nowrap"
                      style={{
                        fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                        color: isActive
                          ? "#7c3aed"
                          : isCompleted
                          ? "#374151"
                          : "#9ca3af",
                      }}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap hidden md:block">
                      {step.sub}
                    </p>
                  </div>
                </button>

                {/* 연결선 */}
                {idx < STEPS.length - 1 && (
                  <div
                    className="flex-1 mx-2 sm:mx-3 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      background:
                        currentStep > step.id
                          ? "linear-gradient(90deg, #b26efd, #93b5f6)"
                          : "#e5e7eb",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 프로그레스 바 */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #f3b0f2, #b26efd, #93b5f6)",
              }}
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <span
            className="text-xs flex-shrink-0"
            style={{ color: "#b26efd", fontWeight: 600 }}
          >
            {progressPct}% 완료
          </span>
        </div>
      </div>
    </div>
  );
}
