"use client";

import { useState, KeyboardEvent } from "react";
import { Tag, Plus, X } from "lucide-react";
import type { BrandReviewData } from "@/features/auth/store/brandReviewStore";
import { QLabel } from "../QLabel";

const MAX_LEN = 500;
const MAX_KEYWORDS = 10;

const SUGGESTED_KEYWORDS = [
  "혁신적인",
  "친근한",
  "프리미엄",
  "지속가능한",
  "대담한",
  "신뢰할 수 있는",
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Step4Props {
  data: BrandReviewData;
  onChange: (partial: Partial<BrandReviewData>) => void;
}

export function Step4BrandImage({ data, onChange }: Step4Props) {
  const [keywordInput, setKeywordInput] = useState("");

  const addKeyword = (value?: string) => {
    const kw = (value ?? keywordInput).trim();
    if (!kw) return;
    if (data.keywords.includes(kw)) return;
    if (data.keywords.length >= MAX_KEYWORDS) return;
    onChange({ keywords: [...data.keywords, kw] });
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    onChange({ keywords: data.keywords.filter((k) => k !== kw) });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  const availableSuggestions = SUGGESTED_KEYWORDS.filter(
    (s) => !data.keywords.includes(s)
  );

  return (
    <div className="space-y-8">
      {/* 원하는 브랜드 인식 */}
      <div>
        <QLabel
          num="1"
          text="고객에게 어떤 브랜드로 인식되고 싶으신가요?"
          sub="고객이 브랜드를 경험한 후 느꼈으면 하는 감정과 인상을 서술해주세요"
        />
        <div className="relative">
          <textarea
            value={data.desiredPerception}
            onChange={(e) =>
              onChange({ desiredPerception: e.target.value.slice(0, MAX_LEN) })
            }
            placeholder='"한 번 써보면 다시 돌아오게 되는, 조용하지만 강한 신뢰감을 주는 브랜드로 기억되고 싶습니다."'
            rows={5}
            className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none transition placeholder-gray-300 leading-relaxed"
            style={{
              borderColor:
                data.desiredPerception.length > 0 ? "#b26efd" : "#e5e7eb",
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-300">
            {data.desiredPerception.length} / {MAX_LEN}
          </div>
        </div>
      </div>

      {/* 핵심 키워드 */}
      <div>
        <QLabel
          num="2"
          text="브랜드 핵심 키워드를 추가해주세요"
          sub={`최대 ${MAX_KEYWORDS}개 · Enter 또는 쉼표로 추가`}
        />

        {/* 입력창 */}
        <div className="flex gap-2 mb-3">
          <div
            className="flex-1 flex items-center gap-2 border-2 rounded-xl px-3 py-2.5 transition"
            style={{
              borderColor: keywordInput ? "#b26efd" : "#e5e7eb",
            }}
          >
            <Tag size={13} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="키워드 입력 후 Enter 또는 쉼표"
              className="flex-1 text-sm text-gray-700 focus:outline-none placeholder-gray-300 bg-transparent"
              disabled={data.keywords.length >= MAX_KEYWORDS}
            />
          </div>
          <button
            type="button"
            onClick={() => addKeyword()}
            disabled={data.keywords.length >= MAX_KEYWORDS}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-opacity disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #b26efd, #93b5f6)",
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 추천 키워드 */}
        {availableSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {availableSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addKeyword(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed text-gray-500 hover:border-[#b26efd] hover:text-[#b26efd] transition-colors"
                style={{ borderColor: "#d1d5db" }}
              >
                + {s}
              </button>
            ))}
          </div>
        )}

        {/* 추가된 키워드 태그 */}
        {data.keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(243,176,242,0.25), rgba(178,110,253,0.18))",
                  color: "#7c3aed",
                  border: "1px solid #d8b4fe",
                  fontWeight: 600,
                }}
              >
                # {kw}
                <button
                  type="button"
                  onClick={() => removeKeyword(kw)}
                  className="text-[#b26efd] hover:text-red-400 transition-colors"
                  aria-label={`${kw} 제거`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-300 text-xs border-2 border-dashed border-gray-200 rounded-xl">
            아직 추가된 키워드가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
