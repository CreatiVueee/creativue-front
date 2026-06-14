"use client";

import { CheckCircle } from "lucide-react";
import type { BrandReviewData } from "@/features/auth/store/brandReviewStore";
import { FileDropzone } from "@/shared/components/ui/FileDropzone";
import { QLabel } from "../QLabel";

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "IT / 테크",
  "패션 / 뷰티",
  "식품 / 음료",
  "헬스케어",
  "교육",
  "라이프스타일",
  "제조 / 소재",
  "금융",
  "엔터 / 미디어",
  "기타",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Step1Props {
  data: BrandReviewData;
  onChange: (partial: Partial<BrandReviewData>) => void;
}

export function Step1BrandInfo({ data, onChange }: Step1Props) {
  const toggleIndustry = (item: string) => {
    onChange({
      industries: data.industries.includes(item)
        ? data.industries.filter((i) => i !== item)
        : [...data.industries, item],
    });
  };

  return (
    <div className="space-y-8">
      {/* 브랜드명 */}
      <div>
        <QLabel num="1" text="브랜드 이름을 입력해주세요" />
        <input
          type="text"
          value={data.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          placeholder="예: CreatiVue, GreenBrew ..."
          className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 focus:outline-none transition placeholder-gray-300"
          style={{
            borderColor: data.brandName ? "#b26efd" : "#e5e7eb",
            background: "transparent",
          }}
        />
      </div>

      {/* 업종 선택 */}
      <div>
        <QLabel
          num="2"
          text="업종을 선택해주세요"
          sub="복수 선택 가능 · 최소 1개 필수"
        />
        <div className="grid grid-cols-3 gap-2">
          {INDUSTRIES.map((industry) => {
            const isSelected = data.industries.includes(industry);
            return (
              <button
                key={industry}
                type="button"
                onClick={() => toggleIndustry(industry)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all"
                style={{
                  borderColor: isSelected ? "#b26efd" : "#e5e7eb",
                  backgroundColor: isSelected ? "rgba(178,110,253,0.05)" : "#fafafa",
                  color: isSelected ? "#7c3aed" : "#4b5563",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {isSelected ? (
                  <CheckCircle
                    size={13}
                    style={{ color: "#b26efd", flexShrink: 0 }}
                  />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className="leading-tight">{industry}</span>
              </button>
            );
          })}
        </div>
        {data.industries.length > 0 && (
          <p className="mt-2 text-xs" style={{ color: "#b26efd", fontWeight: 600 }}>
            {data.industries.length}개 선택됨 ✓
          </p>
        )}
      </div>

      {/* 로고 업로드 */}
      <div>
        <QLabel
          num="3"
          text="로고 또는 브랜드 이미지를 업로드해주세요"
          sub="선택사항 · PNG, JPG, PDF 지원 (최대 20MB)"
        />
        <FileDropzone
          file={data.logoFile}
          onFile={(file) => onChange({ logoFile: file })}
          onClear={() => onChange({ logoFile: null })}
        />
      </div>
    </div>
  );
}
