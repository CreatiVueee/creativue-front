"use client";

import { Globe, User, ShoppingBag } from "lucide-react";
import type { BrandReviewData } from "@/features/auth/store/brandReviewStore";
import { QLabel } from "../QLabel";

// ─── Constants ────────────────────────────────────────────────────────────────

const MARKET_OPTIONS = ["국내", "해외", "모두"] as const;
const GENDER_OPTIONS = ["여성 중심", "남성 중심", "무관"] as const;
const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대+"] as const;
const INTEREST_OPTIONS = [
  "뷰티",
  "테크",
  "스포츠",
  "음식",
  "여행",
  "패션",
  "교육",
  "환경",
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function RadioGroup<T extends string>({
  label,
  icon: Icon,
  options,
  value,
  onSelect,
}: {
  label: string;
  icon: React.ElementType;
  options: readonly T[];
  value: string;
  onSelect: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1">
        <Icon size={11} />
        {label}
      </p>
      <div className="flex gap-2">
        {options.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="flex-1 py-2 rounded-lg border-2 text-xs transition-all"
              style={{
                borderColor: isActive ? "#b26efd" : "#e5e7eb",
                backgroundColor: isActive
                  ? "rgba(178,110,253,0.05)"
                  : "#fafafa",
                color: isActive ? "#7c3aed" : "#6b7280",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Step5Props {
  data: BrandReviewData;
  onChange: (partial: Partial<BrandReviewData>) => void;
}

export function Step5TargetConsumer({ data, onChange }: Step5Props) {
  const toggleMulti = (
    field: "ageGroups" | "interests",
    value: string
  ) => {
    const arr = data[field];
    onChange({
      [field]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  };

  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    borderColor: isActive ? "#b26efd" : "#e5e7eb",
    backgroundColor: isActive ? "rgba(178,110,253,0.05)" : "#fafafa",
    color: isActive ? "#7c3aed" : "#6b7280",
    fontWeight: isActive ? 600 : 400,
  });

  return (
    <div className="space-y-6">
      <QLabel
        num="1"
        text="타겟 소비자를 설정해주세요"
        sub="아래 항목을 선택하거나 직접 입력해주세요"
      />

      <div className="space-y-5">
        {/* 타겟 시장 */}
        <RadioGroup
          label="타겟 시장"
          icon={Globe}
          options={MARKET_OPTIONS}
          value={data.market}
          onSelect={(v) => onChange({ market: v })}
        />

        {/* 성별 */}
        <RadioGroup
          label="성별"
          icon={User}
          options={GENDER_OPTIONS}
          value={data.gender}
          onSelect={(v) => onChange({ gender: v })}
        />

        {/* 연령대 */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium">
            연령대 (복수 선택)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => toggleMulti("ageGroups", age)}
                className="px-3 py-1.5 rounded-full border-2 text-xs transition-all"
                style={chipStyle(data.ageGroups.includes(age))}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* 관심사 */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium">
            관심사 (복수 선택)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleMulti("interests", interest)}
                className="px-3 py-1.5 rounded-full border-2 text-xs transition-all"
                style={chipStyle(data.interests.includes(interest))}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* 직업군 */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1">
            <ShoppingBag size={11} />
            직업군
          </p>
          <input
            type="text"
            value={data.occupation}
            onChange={(e) => onChange({ occupation: e.target.value })}
            placeholder="예: 직장인, 프리랜서, 자영업자 ..."
            className="w-full rounded-xl border-2 px-3 py-2.5 text-xs text-gray-700 focus:outline-none transition placeholder-gray-300"
            style={{
              borderColor: data.occupation ? "#b26efd" : "#e5e7eb",
            }}
          />
        </div>
      </div>

      {/* 기타 사항 */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5 font-medium">
          📝 기타 추가 사항
        </p>
        <textarea
          value={data.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="전문가에게 전달하고 싶은 추가 내용을 자유롭게 작성해주세요."
          rows={4}
          className="w-full rounded-xl border-2 px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none transition placeholder-gray-300"
          style={{
            borderColor: data.additionalNotes ? "#b26efd" : "#e5e7eb",
          }}
        />
      </div>
    </div>
  );
}
